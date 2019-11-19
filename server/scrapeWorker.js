const util = require("util")
const exec = util.promisify(require("child_process").exec)
const Color = require("color")

const MAX_ID = require("./graph2.js").MAX_ID

const RETRY_TIMEOUT = 2 * 6000
const HISTORY_PERCENTAGE = 1

const Queue = require("bee-queue")
const queueConf = require("./queue.config.js")

const scrapeQueue = new Queue("scrape", queueConf)
const importQueue = new Queue("import", queueConf)

const formatPixel =
	"%[fx:int(255*r+.5)],%[fx:int(255*g+.5)],%[fx:int(255*b+.5)]\n"

const PIXEL_CMD = file =>
	`convert ${file} -trim -resize 1x1 -format "${formatPixel}" info:-`

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

scrapeQueue.on("ready", () => {
	scrapeQueue.process(async job => {
		console.log("Processing", job.data)
		const captureOK = false
		let { randomId } = job.data
		while (!captureOK) {
			const { stdout, stderr } = await scrapeImage(randomId)
			const capture = stdout
				.split("\n")
				.find(line => line.indexOf("CAPTURE:") > -1)

			if (capture && stderr.length === 0) {
				const file = capture.substr(9, capture.length - 1)
				console.log("File:", file)

				const check = await isImageSuitable(file)
				if (check) {
					const job = importQueue.createJob({ file, camId: randomId })
					job.save(logSave)
					captureOK = true
				} else {
					console.error(`Retrying. File too bright or dark ${check}.`)
					randomId = getNewRandomId()
				}
			} else {
				console.error("Retrying. Unsucessful capture.")
				randomId = getNewRandomId()
			}
			await sleep(RETRY_TIMEOUT)
		}
		return { ...job.data, stdout, stderr }
	})
	console.log("Processing jobs...")
})

async function scrapeImage(randomId) {
	const SCRAPE_CMD = `node scraper/scrape_camera.js ${randomId}`
	console.log(SCRAPE_CMD)
	const { stdout, stderr } = await exec(SCRAPE_CMD)
	console.log(stdout)
	console.error(stderr)
	return { stdout, stderr }
}

function logSave(err, job) {
	if (err) {
		console.error("Job failed to save", job.data)
	} else {
		console.log("Saved job", job.id, job.data)
	}
}

async function isImageSuitable(file) {
	const isTooDark = false
	const isTooBright = false
	const isMonochrome = false
	const resizeCmd = PIXEL_CMD(`files/scraped/${file}`)

	console.log(resizeCmd)

	const { stdout, stderr } = await exec(resizeCmd)

	if (stderr.length > 0) {
		console.error("Failed to check color")
		return false
	}

	const [r, g, b] = stdout.split(",").map(c => parseFloat(c))
	console.log("Checking color:", r, g, b)

	const avg = (r + g + b) / 3

	if (avg < 0 + 8) {
		isTooDark = true
	}
	if (avg > 255 - 8) {
		isTooDark = true
	}
	if (r === g && g === b && b === avg) {
		isMonochrome = true
	}

	console.log("Avg:", avg, isTooDark, isTooBright, isMonochrome)

	return !isTooDark && !isTooBright && !isMonochrome
}

function getNewRandomId() {
	const randomId = Math.floor(
		(MAX_ID / 100) * (100 - HISTORY_PERCENTAGE) +
			Math.floor(Math.random() * ((MAX_ID / 100) * HISTORY_PERCENTAGE))
	)
	return randomId
}

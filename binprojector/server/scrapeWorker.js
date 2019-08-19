const util = require("util")
const exec = util.promisify(require("child_process").exec)

const Queue = require("bee-queue")

const scrapeQueue = new Queue("scrape")
const importQueue = new Queue("import")

scrapeQueue.on("ready", () => {
	scrapeQueue.process(async job => {
		console.log("Processing", job.data)
		const { stdout, stderr } = await scrapeImage(job.data)
		return { ...job.data, stdout, stderr }
	})
	console.log("Processing jobs...")
})

async function scrapeImage(data) {
	const { randomId } = data
	const SCRAPE_CMD = `node scraper/scrape_camera.js ${randomId}`
	console.log(SCRAPE_CMD)
	const { stdout, stderr } = await exec(SCRAPE_CMD)
	console.log(stdout, stderr)
	const capture = stdout
		.split("\n")
		.find(line => line.indexOf("CAPTURE:") > -1)
	if (capture && stderr.length === 0) {
		const file = capture.substr(9, capture.length - 1)
		console.log("File", file)
		const job = importQueue.createJob({ file, camId: randomId })
		job.save(logSave)
	}

	return { stdout, stderr }
}

function logSave(err, job) {
	if (err) {
		console.error("Job failed to save", job.data)
	} else {
		console.log("Saved job", job.id, job.data)
	}
}

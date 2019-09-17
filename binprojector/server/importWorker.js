const fetch = require("node-fetch")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

const Queue = require("bee-queue")
const queueConf = require("./queue.config.js")

const importQueue = new Queue("import", queueConf)

const fallbackServerHost =
	process.env === "development" ? "localhost:3001" : "api:3001"
const SERVER_HOST = process.env.SERVER_HOST || fallbackServerHost

importQueue.on("ready", () => {
	importQueue.process(async job => {
		console.log("Processing", job.data)
		const { stdout, stderr, status } = await importImage(job.data)
		return { ...job.data, stdout, stderr, status }
	})
	console.log("Processing jobs...")
})

const RES = `512x360\!`

async function importImage(data) {
	const { file, camId } = data
	const convertCmd = `convert files/scraped/${file} -define profile:skip="*" -trim -clamp -resize ${RES} -colorspace sRGB files/imported/${file}.MAT`
	console.log(convertCmd)
	const { stdout, stderr } = await exec(convertCmd)
	console.log(stdout, stderr)
	const { status } = await fetch(
		`http://${SERVER_HOST}/g2/add?file=${file}.MAT&camId=${camId}`
	)
	console.log("Submitted to Graph:", status === 200 ? "200 OK" : status)
	return { stdout, stderr, status }
}

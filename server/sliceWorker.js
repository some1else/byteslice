const fetch = require("node-fetch")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

const Queue = require("bee-queue")
const queueConf = require("./queue.config.js")

const sliceQueue = new Queue("slice", queueConf)

const fallbackServerHost =
	process.env === "development" ? "localhost:3001" : "api:3001"
const SERVER_HOST = process.env.SERVER_HOST || fallbackServerHost

sliceQueue.on("ready", () => {
	sliceQueue.process(async job => {
		console.log("Processing", job.data)
		const { stdout, stderr, status } = await sliceEdges(job.data)
		return { ...job.data, stdout, stderr, status }
	})
	console.log("Processing jobs...")
})

async function sliceEdges(data) {
	const { edge, sourceVert, targetVert } = data
	const {
		data: { file: sourceFile }
	} = sourceVert
	const {
		data: { file: targetFile }
	} = targetVert

	const sliceCmd =
		`./binrender.sh ` +
		`files/imported/${sourceFile} ` +
		`files/imported/${targetFile} ` +
		`files/sliced/${sourceFile}.${targetFile}.MAT ` +
		`MAT`

	console.log(sliceCmd)

	const { stdout, stderr } = await exec(sliceCmd)
	console.log(stdout)
	console.error(stderr)
	const bothOutputs = stdout + stderr
	if (
		bothOutputs.indexOf("improper image header") === -1 &&
		bothOutputs.indexOf("no images defined") === -1 &&
		bothOutputs.indexOf("unable to open image") === -1
	) {
		const { status } = await fetch(
			`http://${SERVER_HOST}/g2/edges/${edge.id}/isRendered`
		)
		console.log("Marked slice as rendered")
	} else {
		const { status } = await fetch(
			`http://${SERVER_HOST}/g2/edges/${edge.id}/isCorrupted`
		)
		console.error("Marked slice as corrupted")
	}
	return { stdout, stderr, status }
}

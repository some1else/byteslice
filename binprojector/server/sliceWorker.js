const fetch = require("node-fetch")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

const Queue = require("bee-queue")

const sliceQueue = new Queue("slice")

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
	console.log(stdout, stderr)
	const { status } = await fetch(
		`http://localhost:3001/g2/edges/${edge.id}/isRendered`
	)
	return { stdout, stderr, status }
}

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


convert files/scraped/cam-1003222-time-1655658329348.png -set colorspace RGB -trim -resize 512x360! -depth 8 -type TrueColor files/imported/cam-1003222-time-1655658329348.png.MAT

convert files/scraped/cam-1004120-time-1655658251874.png -set colorspace RGB -trim -resize 512x360! -depth 8 -type TrueColor files/imported/cam-1004120-time-1655658251874.png.MAT

./binrender.sh files/imported/cam-1003222-time-1655658329348.png.MAT files/imported/cam-1004120-time-1655658251874.png.MAT files/sliced/cam-1003222-time-1655658329348.png.MAT.cam-1004120-time-1655658251874.png.MAT.MAT MAT

async function importImage(data) {
	const { file, camId } = data
	const convertCmd = `convert files/scraped/${file} -set colorspace RGB -trim -resize ${RES} -depth 8 -type TrueColor files/imported/${file}.MAT`
	console.log(convertCmd)
	const { stdout, stderr } = await exec(convertCmd)
	console.log(stdout, stderr)
	const { status } = await fetch(
		`http://${SERVER_HOST}/g2/add?file=${file}.MAT&camId=${camId}`
	)
	console.log("Submitted to Graph:", status === 200 ? "200 OK" : status)
	return { stdout, stderr, status }
}

const Queue = require("bee-queue")
const queueConf = require("./queue.config.js")
const path = require("path")
const fs = require("fs")

const importQueue = new Queue("import", queueConf)

const util = require("util")
const exec = util.promisify(require("child_process").exec)

// const files = {
// 	"1": "cam-001-time-01.png",
// 	"2": "cam-002-time-02.png",
// 	"3": "cam-003-time-03.png",
// 	"4": "cam-004-time-04.png",
// 	// "5": "cam-005-time-05.png",
// 	"6": "cam-006-time-06.png",
// 	"7": "cam-007-time-07.png",
// 	// "8": "cam-008-time-08.png",
// 	"9": "cam-009-time-09.png",
// 	"10": "cam-010-time-10.png",
// 	"11": "cam-011-time-11.png"
// }

const files = []

function logSave(err, job) {
	if (err) {
		console.error("Job failed to save", job.data)
	} else {
		console.log("Saved job", job.id, job.data)
	}
}

// for (let i = 0; i < Object.keys(files).length; i++) {
// 	const key = Object.keys(files)[i]
// 	const file = files[key]
// 	const job = importQueue.createJob({ file, camId: key })
// 	job.save(logSave)
// }

async function main() {
	const directoryPath = path.join(__dirname, "..", "files", "scraped")

	fs.readdir(directoryPath, function(err, files) {
		if (err) {
			return console.log("Unable to scan directory: " + err)
		}

		let i = 1
		files.forEach(function(file) {
			console.log(file)

			const job = importQueue.createJob({ file, camId: i++ })

			job.save(logSave)
		})
	})
}

main()

const Queue = require("bee-queue")
const queueConf = require("./queue.config.js")

const importQueue = new Queue("import", queueConf)

const files = {
	"1": "cam-001-time-01.png",
	"2": "cam-002-time-02.png",
	"3": "cam-003-time-03.png",
	"4": "cam-004-time-04.png",
	// "5": "cam-005-time-05.png",
	"6": "cam-006-time-06.png",
	"7": "cam-007-time-07.png",
	// "8": "cam-008-time-08.png",
	"9": "cam-009-time-09.png",
	"10": "cam-010-time-10.png",
	"11": "cam-011-time-11.png"
}

function logSave(err, job) {
	if (err) {
		console.error("Job failed to save", job.data)
	} else {
		console.log("Saved job", job.id, job.data)
	}
}

for (let i = 0; i < Object.keys(files).length; i++) {
	const key = Object.keys(files)[i]
	const file = files[key]
	const job = importQueue.createJob({ file, camId: key })
	job.save(logSave)
}

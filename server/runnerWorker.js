#!/usr/bin/env node

const MIN_COUNT = 150
const MAX_COUNT = 420
const DEFAULT_SLEEP = 90

const util = require("util")
const exec = util.promisify(require("child_process").exec)

async function getVertexCount() {
	let vertex_count = 0
	try {
		const COUNT_VERTICES = "curl http://$SERVER_HOST/count"
		console.log(COUNT_VERTICES)
		const { stdout: countStdOut } = await exec(COUNT_VERTICES)
		vertex_count = parseInt(countStdOut)
		console.log(vertex_count)
	} catch {
		console.error("Could not count vertices")
	}
	return vertex_count
}

async function scheduleCapture() {
	try {
		const SCHEDULE_CAPTURE = "curl http://$SERVER_HOST/run"
		console.log(SCHEDULE_CAPTURE)
		const { stdout: captureStdOut } = await exec(SCHEDULE_CAPTURE)
		console.log(captureStdOut)
	} catch {
		console.error("Could not schedule capture")
	}
}

let count = 0

async function main() {
	while (count < MAX_COUNT) {
		if (count < MIN_COUNT) {
			const sleepCmd = `sleep ${DEFAULT_SLEEP}`
			console.log(sleepCmd)
			await exec(sleepCmd)
		} else {
			const now = new Date().getTime() / 1000
			const ninePM = new Date().setHours(21, 0) / 1000
			const deltaTime = ninePM - now
			const deltaCount = MAX_COUNT - count
			const sleepTime = Math.ceil(deltaTime / deltaCount)
			console.log(now, ninePM, deltaTime, deltaCount, sleepTime)
			const sleepCmd = `sleep ${sleepTime}`
			console.log(sleepCmd)
			await exec(sleepCmd)
		}
		await scheduleCapture()
		count = await getVertexCount()
	}
}

main()

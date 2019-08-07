#!/usr/bin/env node

const util = require("util")
const exec = util.promisify(require("child_process").exec)

// const RES = `1024x720\!`
const RES = `512x360\!`

const RM_CMD = "rm -rf output/*"
const LIST_CMD = "ls -1 import/ | grep -v .MAT"
async function main() {
	console.log(RM_CMD)
	await exec(RM_CMD)

	console.log(LIST_CMD)
	const { stdout: listStdOut } = await exec(LIST_CMD)

	const images = listStdOut.split("\n").filter(el => el !== "")
	console.log("images", images)

	await images.forEach(async function(img) {
		const convertCmd = `convert import/${img} -resize ${RES} -colorspace srgb -type TrueColorAlpha import/${img}.MAT`
		console.log(convertCmd)
		const { stdout: convertStdOut, stderr: convertStdErr } = await exec(
			convertCmd
		)
		console.log(convertStdOut, convertStdErr)
	})

	await exec("sleep 2")

	for (var i = 0; i < images.length; i++) {
		for (var j = i + 1; j < images.length; j++) {
			const img1 = images[i]
			const img2 = images[j]

			const renderCmd = `./binrender.sh import/${img1}.MAT import/${img2}.MAT output/${img1}.${img2}.MAT MAT`
			console.log(renderCmd)
			const { stdout: renderStdOut, stderr: renderStdErr } = await exec(
				renderCmd
			)
			console.log(renderStdOut, renderStdErr)
		}
	}

	await exec("rm -rf output/*.MAT")
}

main()

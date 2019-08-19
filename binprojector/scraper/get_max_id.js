const NEW_CAMS_URL = "http://www.insecam.org/en/bynew/"

const fs = require("fs")
const puppeteer = require("puppeteer")
const { disableImagesAndScripts } = require("./utils.js")

;(async () => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()

	await disableImagesAndScripts(page)

	await page.goto(NEW_CAMS_URL, {
		waitUntil: "load",
		timeout: 30 * 1000,
	})

	const maxId = await page.evaluate(() => {
		const { href } = document.querySelector(".thumbnail-item__wrap")
		const i = href.lastIndexOf("/view/") + 6
		const j = href.lastIndexOf("/") - 1
		const id = href.substr(i, j)
		return parseInt(id)
	})

	console.log(maxId + "\n")

	const timestamp = new Date().getTime()

	const stream = fs.createWriteStream(`max_id.txt`)
	stream.once("open", function(fd) {
		stream.write(maxId.toString() + "\n")
		stream.end()
	})

	await browser.close()
})()

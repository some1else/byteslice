const NEW_CAMS_URL = "http://www.insecam.org/en/bynew/"

const CAM_ID = process.argv[2]

const LOAD_TIMEOUT = 15 * 1000

const fs = require("fs")
const puppeteer = require("puppeteer")
const puppeteerConf = require("./puppeteer.config.js")
const { disableImagesAndScripts } = require("./utils.js")

;(async () => {
	const browser = await puppeteer.launch(puppeteerConf)
	const page = await browser.newPage()

	await disableImagesAndScripts(page)

	const camstreamURL = `http://www.insecam.org/en/view/${CAM_ID}/`

	const response = await page.goto(camstreamURL, {
		waitUntil: "load",
		timeout: LOAD_TIMEOUT,
	})

	if (response.status() === 200) {
		const imageSource = await page.evaluate(() => {
			const imageEl = document.getElementById("image0")
			return imageEl.src
		})

		await tryImage(browser, imageSource, CAM_ID)
	} else {
		console.error("ERROR: response.status not 200", response.status())
	}

	await browser.close()
})()

async function tryImage(browser, imageSource, camId) {
	const newPage = await browser.newPage()

	let respError = false

	console.log("CAM_ID:", camId)

	newPage.on("response", (resp) => {
		if (resp.url() === "http://www.insecam.org/static/no.jpg") {
			respError = true
		}
		// respError && console.error("ERROR:", "resp.url() is", resp.url())
	})

	try {
		resp = await newPage.goto(imageSource, {
			waitUntil: "load",
			timeout: LOAD_TIMEOUT,
		})

		if (!respError) {
			const ts = new Date().getTime()
			const image = `cam-${camId}-time-${ts}.png`
			await newPage.screenshot({
				path: `files/scraped/${image}`,
			})
			console.log("CAPTURE:", image)
		} else {
			console.error("ERROR: LOADED PLACEHOLDER IMAGE")
		}
	} catch (e) {
		if (!respError) {
			await newPage.waitFor(LOAD_TIMEOUT)
			if (newPage.url() !== "http://www.insecam.org/static/no.jpg") {
				const ts = new Date().getTime()
				const image = `cam-${camId}-time-${ts}.png`
				await newPage.screenshot({
					path: `files/scraped/${image}`,
				})
				console.log("CAPTURE:", image)
			} else {
				console.error("ERROR:", "newPage.url() ===", newPage.url())
			}
		} else {
			console.error("ERROR: Response error")
		}
	}
}

const puppeteer = require("puppeteer")

;(async () => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	try {
		await page.goto(
			"http://217.225.240.32/cgi-bin/faststream.jpg?stream=half&fps=15&rand=COUNTER",
		)

		await page.screenshot({ path: "example-2.png" })
	} catch (e) {
		await page.screenshot({ path: "example-2.png" })
	}

	await browser.close()
})()

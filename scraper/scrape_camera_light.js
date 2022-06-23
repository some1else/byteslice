const CAM_ID = process.argv[2]

// const fs = require("fs")
const fetch = require("node-fetch")
const util = require("util")
const exec = util.promisify(require("child_process").exec)

;(async () => {
  const camstreamURL = `http://www.insecam.org/en/view/${CAM_ID}/`

  // const response = await page.goto(camstreamURL, {
  // 	waitUntil: "load",
  // 	timeout: LOAD_TIMEOUT,
  // })

  const response = await fetch(camstreamURL)

  if (response.status === 200) {
    const text = await response.text()

    // console.log(text)

    let imageURLs = text.match(/(image0)\" src=\".+?\"/)

    let imgURL

    if (imageURLs !== null) {
      // 'image0" src="/static/no.jpg"'
      imgURL = imageURLs[0].substring(13, imageURLs[0].length - 1)
    } else {
      // <source src="
      imageURLs = text.match(/<source src=\".+?\"/)

      if (imageURLs !== null) {
        imgURL = imageURLs[0].substring(13, imageURLs[0].length - 1)
      }
    }

    console.log("Detected image URL", imageURLs && imageURLs[0])

    if (imgURL) {
      if (imgURL !== "/static/no.jpg" && imgURL.indexOf(".mjpg") === -1) {
        const ts = new Date().getTime()
        const fileName = `cam-${CAM_ID}-time-${ts}.png`
        const filePath = `files/scraped/${fileName}`

        const downloadCmd = `curl -s "${imgURL}" > ${filePath}`

        console.log("Download from", downloadCmd)

        const { stdout, stderr } = await exec(downloadCmd)

        if (!stderr) {
          console.log("CAPTURE:", fileName)
        } else {
          console.error("ERROR", stderr)
        }
      } else {
        console.error("ERROR", imgURL)
      }
    }
  } else {
    console.error("ERROR: response.status not 200", response.status)
  }

  // if (response.status() === 200) {
  // 	const imageSource = await page.evaluate(() => {
  // 		const imageEl = document.getElementById("image0")
  // 		return imageEl.src
  // 	})

  // 	await tryImage(browser, imageSource, CAM_ID)
})()

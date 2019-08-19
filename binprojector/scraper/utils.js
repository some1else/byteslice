const disableImagesAndScripts = async function(page) {
	await page.setRequestInterception(true)
	page.on("request", (request) => {
		if (
			request.resourceType() === "image" ||
			request.resourceType() === "script"
		) {
			request.abort()
		} else {
			request.continue()
		}
	})
}

module.exports = {
	disableImagesAndScripts,
}

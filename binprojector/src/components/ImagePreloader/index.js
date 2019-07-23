import React from "react"

const imgStyle = {
	position: "absolute",
	opacity: 0
}

function getImagesFor(imageA, imageB) {
	const desiredImages = []

	for (let i = 0; i <= 100; i++) {
		const image = `/mat-lab-3-renders/${imageA}${imageB}.MAT-${i}.MAT.png`
		desiredImages.push(image)
	}

	return desiredImages
}

const ImagePreloader = () => {
	let preloadedImages = []

	const ab = getImagesFor("a", "b")
	const ca = getImagesFor("a", "c")
	const bc = getImagesFor("b", "c")

	preloadedImages = preloadedImages.concat(ab, ca, bc)

	return (
		<div>
			{preloadedImages.map(img => (
				<img key={img} src={img} style={imgStyle} alt="" />
			))}
		</div>
	)
}

export default ImagePreloader

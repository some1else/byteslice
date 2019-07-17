import React from "react"

const imgStyle = {
	position: "absolute",
	opacity: 0
}

function getImagesFor(imageA, imageB) {
	const desiredImages = []

	for (let i = 1; i <= 100; i++) {
		const image = `/mat-lab-3-renders/${imageA}${imageB}.MAT-${i}.MAT.png`
		desiredImages.push(image)
	}

	return desiredImages
}

const ImagePreloader = () => {
	let preloadedImages = []

	const ab = getImagesFor("a", "b")
	// const	ba = getImagesFor('b', 'a')
	// const	ac = getImagesFor('a', 'c')
	const ca = getImagesFor("a", "c")
	// const	cb = getImagesFor('c', 'b')
	const bc = getImagesFor("b", "c")

	preloadedImages = preloadedImages.concat(
		ab,
		// ba,
		// ac,
		ca,
		// cb,
		bc
	)

	return (
		<div>
			{preloadedImages.map(img => (
				<img key={img} src={img} style={imgStyle} />
			))}
		</div>
	)
}

export default ImagePreloader

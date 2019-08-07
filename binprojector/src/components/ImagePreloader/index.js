import React, { Fragment } from "react"

import { BASEPATH, EXT } from "../../App"

// const BASEPATH_OLD = "/mat-lab-3-renders"

const imgStyle = {
	position: "absolute",
	opacity: 0
}

function getImagesFor(imageA, imageB) {
	const desiredImages = []

	for (let i = 0; i <= 100; i++) {
		const image = `${BASEPATH}/${imageA}${imageB}.MAT-${i}.MAT.${EXT}`
		desiredImages.push(image)
	}

	return desiredImages
}

const ImagePreloader = ({ edges = [] }) => {
	let preloadedImages = []

	edges.forEach(edge => {
		preloadedImages = preloadedImages.concat(getImagesFor(edge.id, ""))
	})

	return (
		<Fragment>
			{preloadedImages.map(img => (
				<img key={img} src={img} style={imgStyle} alt="" />
			))}
		</Fragment>
	)
}

export default ImagePreloader

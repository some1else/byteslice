import React, { Fragment } from "react"

import { BASEPATH, EXT, STEPS } from "../../App"

// const BASEPATH_OLD = "/mat-lab-3-renders"

const imgStyle = {
	position: "absolute",
	opacity: 0
}

function getImagesFor(edge, vertices) {
	const imageA = vertices.find(v => v.id === edge.source).data.file
	const imageB = vertices.find(v => v.id === edge.target).data.file

	const desiredImages = []

	for (let i = 0; i <= STEPS; i++) {
		const image = `${BASEPATH}/${imageA}.${imageB}.MAT-${i}.MAT.${EXT}`
		desiredImages.push(image)
	}

	return desiredImages
}

const ImagePreloader = ({ edges = [], vertices = [] }) => {
	let preloadedImages = []

	edges.forEach(edge => {
		preloadedImages = preloadedImages.concat(getImagesFor(edge, vertices))
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

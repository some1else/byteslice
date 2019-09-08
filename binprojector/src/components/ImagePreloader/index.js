import React, { PureComponent, Fragment } from "react"

import { BASEPATH, EXT, STEPS } from "../../App"

const imgStyle = {
	position: "absolute",
	opacity: 0,
}

function getEdgeImages(edge, vertices) {
	const imageA = vertices.find((v) => v.id === edge.source).data.file
	const imageB = vertices.find((v) => v.id === edge.target).data.file

	const desiredImages = []

	for (let i = 0; i <= STEPS; i++) {
		const image = `${BASEPATH}/${imageA}.${imageB}.MAT-${i}.MAT.${EXT}`
		desiredImages.push(image)
	}

	return desiredImages
}

// TODO: Decide if preloading neighboring edges is required
function getNeighboringEdges(edges, vertices, edge) {
	const vertA = vertices.find(({ id }) => id === edge.source)
	const vertB = vertices.find(({ id }) => id === edge.target)
	return edges.filter(({ id }) => {
		const isANeighbor = vertA.edges.indexOf(id) > -1
		const isBNeighbor = vertB.edges.indexOf(id) > -1
		return isANeighbor || isBNeighbor
	})
}

class ImagePreloader extends PureComponent {
	state = {
		preloadedEdges: [],
		preloadedImages: [],
	}

	componentDidUpdate(prevProps) {
		const { edge, vertices = [] } = this.props
		const { preloadedEdges, preloadedImages } = this.state

		if (preloadedEdges.indexOf(edge) > -1) return false

		const { edge: prevEdge } = prevProps
		if (prevEdge !== edge) {
			this.setState({
				preloadedImages: [
					...preloadedImages,
					...getEdgeImages(edge, vertices),
				],
				preloadedEdges: [...preloadedEdges, edge],
			})
		}
	}

	render() {
		const { preloadedImages } = this.state

		return (
			<Fragment>
				{preloadedImages.map((img, i) => (
					<img
						key={`preload-${img}-${i}`}
						src={img}
						style={imgStyle}
						alt=""
					/>
				))}
			</Fragment>
		)
	}
}

export default ImagePreloader

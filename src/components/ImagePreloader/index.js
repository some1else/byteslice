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
		currentNeighborhood: [],
	}

	componentDidMount() {
		const { edge } = this.props
		this.updateNeighborhood(edge)
	}

	componentDidUpdate(prevProps) {
		const { edge: prevEdge } = prevProps
		const { edge } = this.props
		const { preloadedEdges } = this.state

		if (preloadedEdges.indexOf(edge) > -1) return false

		if (prevEdge !== edge) {
			this.updateNeighborhood(edge)
		}
	}

	updateNeighborhood(edge) {
		const { edges, vertices } = this.props
		const { preloadedEdges } = this.state

		const edgeImages = {
			id: edge.id,
			images: getEdgeImages(edge, vertices),
		}

		const neighbors = getNeighboringEdges(edges, vertices, edge)
		const neighborImages = neighbors.map((e) => ({
			id: e.id,
			images: getEdgeImages(e, vertices),
		}))

		this.setState({
			currentNeighborhood: [edgeImages, ...neighborImages],
			preloadedEdges: [
				...preloadedEdges,
				// New neighbors
				...neighbors.filter((n) => preloadedEdges.indexOf(n) === -1),
				// Current edge, if new
				preloadedEdges.indexOf(edge) === -1 && edge,
			],
		})
	}

	render() {
		const { onImageLoaded } = this.props
		const { currentNeighborhood } = this.state
		return (
			<Fragment>
				{currentNeighborhood.map((edge) =>
					edge.images.map((img, i) => (
						<img
							key={`preload-${img}-${i}`}
							src={img}
							style={imgStyle}
							alt=""
							onLoad={() => onImageLoaded(edge.id)}
						/>
					)),
				)}
			</Fragment>
		)
	}
}

export default ImagePreloader

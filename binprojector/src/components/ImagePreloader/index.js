import React, { PureComponent, Fragment } from "react"

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

class ImagePreloader extends PureComponent {
	state = {
		preloadedEdgesCount: 0
	}

	componentDidMount() {
		const { onPreloaded, edges } = this.props

		this.preloadInterval = setInterval(() => {
			const { preloadedEdgesCount } = this.state
			this.setState({ preloadedEdgesCount: preloadedEdgesCount + 1 })
			if (preloadedEdgesCount + 1 >= edges.length) {
				clearInterval(this.preloadInterval)
				onPreloaded && onPreloaded()
			}
		}, 400)
	}

	// handleImageLoad = () => {
	// 	setTimeout(() => {
	// 		this.setState(({ preloadedEdgesCount }) => ({
	// 			preloadedEdgesCount: preloadedEdgesCount + 1
	// 		}))
	// 	}, 1000)
	// }

	render() {
		const { edges = [], vertices = [] } = this.props
		const { preloadedEdgesCount } = this.state

		let preloadedImages = []

		edges.slice(0, preloadedEdgesCount + 1).forEach(edge => {
			preloadedImages = preloadedImages.concat(getImagesFor(edge, vertices))
		})

		return (
			<Fragment>
				{preloadedEdgesCount + 1 <= edges.length && (
					<span>
						{preloadedEdgesCount} / {edges.length}
						<br />
						{Math.ceil((preloadedEdgesCount / edges.length) * 100)} %
					</span>
				)}
				{preloadedImages.map(img => (
					<img
						key={img}
						src={img}
						style={imgStyle}
						alt=""
						// onLoad={this.handleImageLoad}
					/>
				))}
			</Fragment>
		)
	}
}

export default ImagePreloader

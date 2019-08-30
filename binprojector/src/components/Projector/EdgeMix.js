import React, { PureComponent } from "react"

import { BASEPATH, EXT } from "../../App"

const FPS = 60
const MIX_SPEED = 0.63 // 0.63
const MIX_FPS = Math.floor(1000 / FPS)

class EdgeMix extends PureComponent {
	state = {
		actualMix: this.props.mix,
		offset: 0
	}

	approachMix = () => {
		const { mix } = this.props
		const { actualMix } = this.state
		const difference = mix - actualMix
		const nextMix = actualMix + Math.round(difference * MIX_SPEED)
		// const newOffset = Math.sin(Date.now() / 1000) * 10
		this.setState({
			actualMix: nextMix
			// offset: newOffset
		})
	}

	componentDidMount() {
		setInterval(() => {
			this.approachMix()
		}, MIX_FPS)
	}

	render() {
		const { actualMix } = this.state
		const { edge, edges, vertices } = this.props

		// const { actualMix, offset } = this.state
		// let finalMix = Math.round(actualMix + offset)
		// if (finalMix > 100) {
		// 	finalMix = 100
		// } else if (finalMix < 0) {
		// 	finalMix = 0
		// }

		if (!edge) return <div />

		const imageA = vertices.find(v => v.id === edge.source)
		const imageB = vertices.find(v => v.id === edge.target)

		const edgeMixStyle = {}

		if (imageA && imageB) {
			const {
				data: { file: imageAFile }
			} = imageA
			const {
				data: { file: imageBFile }
			} = imageB

			const mixURL = `${BASEPATH}/${imageAFile}.${imageBFile}.MAT-${actualMix}.MAT.${EXT}`

			edgeMixStyle.backgroundImage = `url('${mixURL}')`
		}

		const ctrStyle = {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			fontSize: "3rem",
			fontWeight: "bold",
			mixBlendMode: "exclusion",
			color: "black",
			background: "white"
		}

		return (
			<div className="EdgeMix" style={edgeMixStyle}>
				{false && (
					<div style={ctrStyle}>
						{edges.length} edges
						<br />
						{vertices.length} vertices
						<br />
						Edge #{edge.id}
						<br />
						from: #{edge.source}, to: #{edge.target}
					</div>
				)}
			</div>
		)
	}
}

export default EdgeMix

import React, { PureComponent } from "react"

import { BASEPATH, EXT, STEPS } from "../../App"

const FPS = 60
const MIX_SPEED = 0.1 // 0.63
const MIX_FPS = Math.floor(1000 / FPS)

function findCommonVertex(edgeA, edgeB) {
	const { source: sourceA, target: targetA } = edgeA
	const { source: sourceB, target: targetB } = edgeB

	if (sourceA === sourceB) {
		return sourceA
	}

	if (sourceA === targetB) {
		return sourceA
	}

	if (targetA === targetB) {
		return targetA
	}

	if (targetA === sourceB) {
		return targetA
	}
}

class EdgeMix extends PureComponent {
	state = {
		actualMix: this.props.mix,
		offset: 0,
	}

	approachMix = () => {
		const { mix, onMixChanged } = this.props
		const { actualMix } = this.state
		const difference = mix - actualMix
		const nextMix = actualMix + Math.round(difference * MIX_SPEED)
		// const newOffset = Math.sin(Date.now() / 1000) * 10
		this.setState({
			actualMix: nextMix,
			// offset: newOffset
		})

		onMixChanged && onMixChanged(actualMix)
	}

	componentDidMount() {
		setInterval(() => {
			this.approachMix()
		}, MIX_FPS)
	}

	render() {
		const { actualMix } = this.state
		const { edge, prevEdge, edges, vertices } = this.props

		// const { actualMix, offset } = this.state
		// let finalMix = Math.round(actualMix + offset)
		// if (finalMix > 100) {
		// 	finalMix = 100
		// } else if (finalMix < 0) {
		// 	finalMix = 0
		// }

		if (!edge) return <div />

		// TODO: Restore slice directionality
		let isInverted = false

		if (prevEdge) {
			const commonVert = findCommonVertex(edge, prevEdge)
			if (edge.source === commonVert) {
				isInverted = true
			}
		}

		const imageA = vertices.find((v) => v.id === edge.source)
		const imageB = vertices.find((v) => v.id === edge.target)

		const edgeMixStyle = {}
		let adjustedMix

		if (imageA && imageB) {
			const {
				data: { file: imageAFile },
			} = imageA
			const {
				data: { file: imageBFile },
			} = imageB

			adjustedMix = isInverted ? STEPS - actualMix : actualMix

			const mixURL = `${BASEPATH}/${imageAFile}.${imageBFile}.MAT-${adjustedMix}.MAT.${EXT}`

			edgeMixStyle.backgroundImage = `url('${mixURL}')`
		}

		const ctrStyle = {
			position: "absolute",
			bottom: "1rem",
			right: "1rem",
			// transform: "translate(-50%, -50%)",
			fontSize: "calc(1rem / 16 * 12)",
			fontWeight: "normal",
			mixBlendMode: "exclusion",
			// color: "black",
			// background: "white",
			color: "white",
			padding: "0.3rem",
		}

		return (
			<div className="EdgeMix" style={edgeMixStyle}>
				{true && (
					<div style={ctrStyle}>
						Mix {Math.round((adjustedMix / STEPS) * 100)}%
						<br />
						Edge #{edge.id}
						<br />
						Loc #{edge.source} &amp; #{edge.target}
						<br />
						{edges.length} edges
						<br />
						{vertices.length} vertices
					</div>
				)}
			</div>
		)
	}
}

export default EdgeMix

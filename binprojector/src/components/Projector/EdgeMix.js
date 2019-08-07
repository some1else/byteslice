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
		const { edgeId } = this.props

		// const { actualMix, offset } = this.state
		// let finalMix = Math.round(actualMix + offset)
		// if (finalMix > 100) {
		// 	finalMix = 100
		// } else if (finalMix < 0) {
		// 	finalMix = 0
		// }

		const mixURL = `${BASEPATH}/${edgeId}.MAT-${actualMix}.MAT.${EXT}`

		const edgeMixStyle = {
			backgroundImage: `url('${mixURL}')`
		}

		return <div className="EdgeMix" style={edgeMixStyle} />
	}
}

export default EdgeMix

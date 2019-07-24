import React, { PureComponent } from "react"

const MIX_SPEED = 0.7 // 0.63
const MIX_FPS = Math.floor(1000 / 60) // 60fps

class EdgeMix extends PureComponent {
	state = {
		actualMix: this.props.mix
	}

	approachMix = () => {
		const { mix } = this.props
		const { actualMix } = this.state
		const difference = mix - actualMix
		const nextMix = actualMix + Math.round(difference * MIX_SPEED)
		this.setState({ actualMix: nextMix })
	}

	componentDidMount() {
		setInterval(() => {
			this.approachMix()
		}, MIX_FPS)
	}

	render() {
		const { actualMix } = this.state
		const { edgeId } = this.props
		const mixURL = `/mat-lab-3-renders/${edgeId}.MAT-${actualMix}.MAT.png`

		const edgeMixStyle = {
			backgroundImage: `url('${mixURL}')`
		}

		return <div className="EdgeMix" style={edgeMixStyle} />
	}
}

export default EdgeMix

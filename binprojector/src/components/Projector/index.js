import React, { PureComponent } from 'react'

import './styles.css'

const locations = ['metelkova', 'njujork', 'montenegro']

class Projector extends PureComponent {
	state = {
		imageA: 'metelkova',
		imageB: 'montenegro',
		desiredMix: 50,
		actualMix: 50,
	}

	pickMix() {
		const newMix = Math.ceil(Math.random() * 100)
		this.setState({ desiredMix: newMix })
	}

	approachDesiredMix() {
		const { desiredMix, actualMix } = this.state
		const difference = desiredMix - actualMix
		const nextMix = actualMix + Math.round(difference * 1 / 3)
		this.setState({ actualMix: nextMix })
	}

	componentDidMount() {
		this.startPickingNewCombinationsOfDestinations()
		this.startPickingNewMixValues()
		this.startApproachingTheDesiredMix()		
	}

	startApproachingTheDesiredMix() {
		setInterval(() => {
			this.approachDesiredMix()
		}, 32)
	}


	pickNewTimeoutDuration(min=200, max=1800) {
		let timeoutDuration = min
		const additionalDuration = Math.round(Math.random() * max)
		return timeoutDuration + additionalDuration
	}

	pickNewMixValue = () => {
		this.pickMix()
		const timeoutDuration = this.pickNewTimeoutDuration(500, 1500)
		setTimeout(this.pickNewMixValue, timeoutDuration)
	}

	startPickingNewMixValues() {
		this.pickNewMixValue()
	}

	pickNewCombinationsOfDestinations = () => {
		const imageA = locations[Math.floor(Math.random() * 3)]
		let imageB = locations[Math.floor(Math.random() * 3)]
		while (imageA === imageB) {
			imageB = locations[Math.floor(Math.random() * 3)]
		}
		this.setState({
			imageA, imageB,
		})

		const timeoutDuration = this.pickNewTimeoutDuration()
		setTimeout(
			this.pickNewCombinationsOfDestinations,
			timeoutDuration
		)
	}

	startPickingNewCombinationsOfDestinations() {
		const timeoutDuration = this.pickNewTimeoutDuration(7000, 15000)

		setTimeout(
			this.pickNewCombinationsOfDestinations,
			timeoutDuration
		)
	}

	goTo = (imageA, imageB) => {
		this.setState({
			imageA, imageB
		})
	}

	render() {
		const { imageA, imageB, actualMix } = this.state

		const imageURL = `/images/${imageA}_${imageB}-${actualMix}.jpg`
		
		const projectorStyle = {
			backgroundImage: `url('${imageURL}')`,
			backgroundSize: 'cover',
		}
		
		return (
			<div className='Projector' style={projectorStyle}>
		
			</div>
		)
	}
}

export default Projector
import React, { PureComponent } from "react"

import "./styles.css"

const locations = ["a", "b", "c"]
const locationPairs = ["ab", "ac", "bc"]

const CROSSFADE_INTERVALS = [100, 401]
const NEW_PAIR_INTERVALS = [4000, 4001]

const getLocationPair = (locA, locB) => {
	const idxA = locations.indexOf(locA)
	const idxB = locations.indexOf(locB)

	let isInverse, locationPair
	if (idxA < idxB) {
		isInverse = false
		locationPair = `${locA}${locB}`
	} else {
		isInverse = true
		locationPair = `${locB}${locA}`
	}

	return {
		isInverse,
		locationPair
	}
}

const getInitialState = () => ({
	imageA: locations[0],
	imageB: locations[1],
	locationPair: locations[0] + locations[1],
	isInverse: false,
	desiredMix: 50,
	actualMix: 50,
	lastMixed: new Date(),
	lastChanged: new Date()
})

class Projector extends PureComponent {
	state = getInitialState()

	pickMix() {
		const newMix = Math.round(Math.random() * 100)
		return newMix
	}

	approachDesiredMix() {
		const { desiredMix, actualMix } = this.state
		const difference = desiredMix - actualMix
		const nextMix = actualMix + Math.round(difference * 0.63)
		this.setState({ actualMix: nextMix })
	}

	componentDidMount() {
		// this.startMixingCereography()
		this.startApproachingTheDesiredMix()
		const duration = this.pickNewTimeoutDuration(
			CROSSFADE_INTERVALS[0],
			CROSSFADE_INTERVALS[1]
		)

		setTimeout(this.handleEvent, duration)
	}

	handleEvent = () => {
		const now = new Date()
		const { lastMixed, lastChanged, desiredMix, actualMix } = this.state
		const changeDuration = this.pickNewTimeoutDuration(
			NEW_PAIR_INTERVALS[0],
			NEW_PAIR_INTERVALS[1]
		)

		const timeHasPassed = now.getTime() - lastChanged.getTime()
		console.log(timeHasPassed)
		const mixOrPick =
			timeHasPassed < changeDuration
				? "mix"
				: actualMix - 1 <= 0 || actualMix + 1 >= 100
				? "pick"
				: "mix"

		if (mixOrPick === "mix") {
			const extremesOrBetweens =
				timeHasPassed > changeDuration ? "extremes" : "betweens"

			let desiredMix
			if (extremesOrBetweens === "extremes") {
				desiredMix = this.flipPickAorB()
			} else {
				desiredMix = this.pickMix()
			}

			this.setState({
				desiredMix,
				lastMixed: now
			})
		} else {
			// pick
			const newState = this.flopPickC()
			this.setState({
				...newState,
				lastMixed: now,
				lastChanged: now
			})
		}

		const duration = this.pickNewTimeoutDuration(
			CROSSFADE_INTERVALS[0],
			CROSSFADE_INTERVALS[1]
		)

		setTimeout(this.handleEvent, duration)
	}

	flipPickAorB() {
		const rand = Math.random()

		let desiredMix
		if (rand > 0.5) {
			desiredMix = 100
		} else {
			desiredMix = 0
		}

		return desiredMix
	}

	flopPickC() {
		const { imageA, imageB, desiredMix } = this.state

		let incomingImg = locations[Math.floor(Math.random() * 3)]
		while (incomingImg === imageA || incomingImg === imageB) {
			incomingImg = locations[Math.floor(Math.random() * 3)]
		}

		let remainingImg, newState
		if (desiredMix === 0) {
			remainingImg = imageA
			newState = {
				imageB: incomingImg
			}
		} else {
			remainingImg = imageB
			newState = {
				imageA: incomingImg
			}
		}

		const { locationPair, isInverse } = getLocationPair(
			desiredMix === 0 ? remainingImg : incomingImg,
			desiredMix === 0 ? incomingImg : remainingImg
		)

		return {
			...newState,
			locationPair,
			isInverse
		}
	}

	startMixingCereography() {
		// this.startPickingNewCombinationsOfDestinations()
		// this.startPickingNewMixValues()
		// this.start
	}

	startApproachingTheDesiredMix() {
		setInterval(() => {
			this.approachDesiredMix()
		}, 16)
	}

	pickNewTimeoutDuration(min = 0, max = 1) {
		let timeoutDuration = min
		const additionalDuration = Math.round(Math.random() * max)
		return timeoutDuration + additionalDuration
	}

	pickNewMixValue = () => {
		const desiredMix = this.pickMix()
		this.setState({ desiredMix })

		const timeoutDuration = this.pickNewTimeoutDuration(
			CROSSFADE_INTERVALS[0],
			CROSSFADE_INTERVALS[1]
		)
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

		const { locationPair, isInverse } = getLocationPair(imageA, imageB)

		this.setState({
			imageA,
			imageB,
			locationPair,
			isInverse
		})

		const timeoutDuration = this.pickNewTimeoutDuration(
			NEW_PAIR_INTERVALS[0],
			NEW_PAIR_INTERVALS[1]
		)

		setTimeout(this.pickNewCombinationsOfDestinations, timeoutDuration)
	}

	pickNewCombinationsOfDestinations2 = () => {
		if (Math.random() > 0.5) {
			this.setState({ desiredMix: this.flipPickAorB() })
		} else {
			this.setState(this.flopPickC())
		}

		const timeoutDuration = this.pickNewTimeoutDuration(
			NEW_PAIR_INTERVALS[0],
			NEW_PAIR_INTERVALS[1]
		)

		setTimeout(this.pickNewCombinationsOfDestinations2, timeoutDuration)
	}

	startPickingNewCombinationsOfDestinations() {
		const timeoutDuration = this.pickNewTimeoutDuration(
			NEW_PAIR_INTERVALS[0],
			NEW_PAIR_INTERVALS[1]
		)

		setTimeout(this.pickNewCombinationsOfDestinations2, timeoutDuration)
	}

	render() {
		const { imageA, imageB, locationPair, isInverse, actualMix } = this.state

		const finalMix = isInverse ? 100 - actualMix : actualMix

		const imageURL = `/mat-lab-3-renders/${locationPair}.MAT-${finalMix}.MAT.png`

		const projectorStyle = {
			backgroundImage: `url('${imageURL}')`,
			backgroundSize: "cover"
		}

		return <div className="Projector" style={projectorStyle}></div>
	}
}

export default Projector

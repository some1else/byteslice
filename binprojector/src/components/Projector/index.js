import React, { PureComponent } from "react"

import "./styles.css"

const locations = ["a", "b", "c"]
const locationPairs = ["ab", "ac", "bc"]

const CROSSFADE_INTERVALS = [64, 256]
const NEW_PAIR_INTERVALS = [1024, 2048]

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
		this.startApproachingTheDesiredMix()
		const duration = this.pickNewTimeoutDuration(
			CROSSFADE_INTERVALS[0],
			CROSSFADE_INTERVALS[1]
		)

		setTimeout(this.handleEventLoop, duration)
	}

	handleEventLoop = () => {
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

			let newDesiredMix
			if (extremesOrBetweens === "extremes") {
				if (desiredMix === 0 || desiredMix === 100) {
					newDesiredMix = desiredMix
				} else {
					newDesiredMix = this.flipPickAorB()
				}
			} else {
				newDesiredMix = this.pickMix()
			}

			this.setState({
				desiredMix: newDesiredMix,
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

		setTimeout(this.handleEventLoop, duration)
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

	render() {
		const { imageA, imageB, locationPair, isInverse, actualMix } = this.state

		const finalMix = isInverse ? actualMix : 100 - actualMix

		const imageURL = `/mat-lab-3-renders/${locationPair}.MAT-${finalMix}.MAT.png`

		const projectorStyle = {
			backgroundImage: `url('${imageURL}')`,
			backgroundSize: "cover"
		}

		return <div className="Projector" style={projectorStyle}></div>
	}
}

export default Projector

import React, { PureComponent } from "react"

import "./styles.css"

const edgeAB = { id: "ab", from: "a", to: "b" }
const edgeAC = { id: "ac", from: "a", to: "c" }
const edgeBC = { id: "bc", from: "b", to: "c" }

const vertA = {
	id: "a",
	edges: ["ab", "ac"]
}
const vertB = {
	id: "b",
	edges: ["ab", "bc"]
}
const vertC = {
	id: "c",
	edges: ["ac", "bc"]
}

const vertices = [vertA, vertB, vertC]
const edges = [edgeAB, edgeAC, edgeBC]

const CROSSFADE_INTERVALS = [64, 256]
const NEW_PAIR_INTERVALS = [1024, 2048]

const getEdge = (vertA, vertB) => {
	const idxA = vertices.indexOf(vertA)
	const idxB = vertices.indexOf(vertB)

	let isInverse, edgeId
	if (idxA < idxB) {
		isInverse = false
		edgeId = `${vertA.id}${vertB.id}`
	} else {
		isInverse = true
		edgeId = `${vertB.id}${vertA.id}`
	}

	const edge = edges.find(({ id }) => edgeId === id)

	return {
		isInverse,
		edge
	}
}

const getInitialState = () => ({
	vertA: vertices[0],
	vertB: vertices[1],
	edge: edges[0],
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
		const { lastChanged, desiredMix, actualMix } = this.state
		const changeDuration = this.pickNewTimeoutDuration(
			NEW_PAIR_INTERVALS[0],
			NEW_PAIR_INTERVALS[1]
		)

		const timeHasPassed = now.getTime() - lastChanged.getTime()

		const mixOrPick =
			timeHasPassed < changeDuration
				? "mix"
				: actualMix - 1 <= 0 || actualMix + 1 >= 100
				? "pick"
				: "mix"

		if (mixOrPick === "mix") {
			// mix strategy
			const extremesOrBetweens =
				timeHasPassed > changeDuration ? "extremes" : "betweens"

			let newDesiredMix
			if (extremesOrBetweens === "extremes") {
				if (desiredMix === 0 || desiredMix === 100) {
					newDesiredMix = desiredMix
				} else {
					newDesiredMix = this.pickAorB()
				}
			} else {
				newDesiredMix = this.pickMix()
			}

			this.setState({
				desiredMix: newDesiredMix,
				lastMixed: now
			})
		} else {
			// pick strategy
			const newState = this.pickNewImage()
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

	pickAorB() {
		const rand = Math.random()

		let desiredMix
		if (rand > 0.5) {
			desiredMix = 100
		} else {
			desiredMix = 0
		}

		return desiredMix
	}

	pickNewImage() {
		const { vertA, vertB, desiredMix } = this.state

		let incomingVertex = vertices[Math.floor(Math.random() * 3)]
		while (incomingVertex === vertA || incomingVertex === vertB) {
			incomingVertex = vertices[Math.floor(Math.random() * 3)]
		}

		let remainingImg, newState
		if (desiredMix === 0) {
			remainingImg = vertA
			newState = {
				vertB: incomingVertex
			}
		} else {
			remainingImg = vertB
			newState = {
				vertA: incomingVertex
			}
		}

		const { edge, isInverse } = getEdge(
			desiredMix === 0 ? remainingImg : incomingVertex,
			desiredMix === 100 ? remainingImg : incomingVertex
		)

		return {
			...newState,
			edge,
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
		const { edge, isInverse, actualMix } = this.state

		const finalMix = isInverse ? actualMix : 100 - actualMix

		const imageURL = `/mat-lab-3-renders/${edge.id}.MAT-${finalMix}.MAT.png`

		const projectorStyle = {
			backgroundImage: `url('${imageURL}')`,
			backgroundSize: "cover"
		}

		return <div className="Projector" style={projectorStyle}></div>
	}
}

export default Projector

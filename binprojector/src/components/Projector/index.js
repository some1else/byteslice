import React, { PureComponent } from "react"

import "./styles.css"

const MIX_MIN = 0
const MIX_MAX = 100

const MIX_FPS = Math.floor(1000 / 60) // 60fps

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

class Projector extends PureComponent {
	state = {
		vertA: vertices[0],
		vertB: vertices[1],
		edge: edges[0],
		useReverseLookup: false,
		desiredMix: MIX_MIN + (MIX_MAX - MIX_MIN) / 2,
		actualMix: MIX_MIN + (MIX_MAX - MIX_MIN) / 2,
		lastMixed: new Date(),
		lastChanged: new Date()
	}

	approachDesiredMix() {
		const { desiredMix, actualMix } = this.state
		const difference = desiredMix - actualMix
		const nextMix = actualMix + Math.round(difference * 0.63)
		this.setState({ actualMix: nextMix })
	}

	componentDidMount() {
		// Start approaching desiredMix
		setInterval(() => {
			this.approachDesiredMix()
		}, MIX_FPS)

		const duration = randomBetween(
			CROSSFADE_INTERVALS[0],
			CROSSFADE_INTERVALS[1]
		)

		setTimeout(this.handleEventLoop, duration)
	}

	handleEventLoop = () => {
		const now = new Date()
		const { lastChanged, desiredMix, actualMix } = this.state
		const changeDuration = randomBetween(
			NEW_PAIR_INTERVALS[0],
			NEW_PAIR_INTERVALS[1]
		)

		const timeHasPassed = now.getTime() - lastChanged.getTime()

		const mixOrPick =
			timeHasPassed < changeDuration
				? "mix"
				: actualMix === MIX_MIN || actualMix === MIX_MAX
				? "pick"
				: "mix"

		if (mixOrPick === "mix") {
			// mix strategy
			const extremesOrBetweens =
				timeHasPassed > changeDuration ? "extremes" : "betweens"

			let newDesiredMix
			if (extremesOrBetweens === "extremes") {
				if (desiredMix === MIX_MIN || desiredMix === MIX_MAX) {
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

		const duration = randomBetween(
			CROSSFADE_INTERVALS[0],
			CROSSFADE_INTERVALS[1]
		)

		setTimeout(this.handleEventLoop, duration)
	}

	pickMix() {
		const newMix = Math.round(Math.random() * MIX_MAX)
		return newMix
	}

	pickAorB() {
		const rand = Math.random()

		let desiredMix
		if (rand > 0.5) {
			desiredMix = MIX_MAX
		} else {
			desiredMix = MIX_MIN
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
		if (desiredMix === MIX_MIN) {
			remainingImg = vertA
			newState = {
				vertB: incomingVertex
			}
		} else if (desiredMix === MIX_MAX) {
			remainingImg = vertB
			newState = {
				vertA: incomingVertex
			}
		} else {
			debugger
		}

		const { edge, useReverseLookup } = getEdge(
			desiredMix === MIX_MIN ? remainingImg : incomingVertex,
			desiredMix === MIX_MAX ? remainingImg : incomingVertex
		)

		return {
			...newState,
			edge,
			useReverseLookup
		}
	}

	render() {
		const { edge, useReverseLookup, actualMix } = this.state

		const mix = useReverseLookup ? actualMix : MIX_MAX - actualMix

		return (
			<div className="Projector">
				<EdgeMix edgeId={edge && edge.id} mix={mix} />
			</div>
		)
	}
}

const EdgeMix = ({ edgeId, mix }) => {
	const mixURL = `/mat-lab-3-renders/${edgeId}.MAT-${mix}.MAT.png`

	const edgeMixStyle = {
		backgroundImage: `url('${mixURL}')`
	}

	return <div className="EdgeMix" style={edgeMixStyle} />
}

class GraphContainer extends PureComponent {
	state = {
		edges: edges,
		vertices: vertices,
		vertA: null,
		vertB: null,
		edge: null
	}

	render() {
		const { edges, vertices } = this.state
		const { children } = this.props
		return children({ edges, vertices })
	}
}

function getEdge(vertA, vertB) {
	const idxA = vertices.indexOf(vertA)
	const idxB = vertices.indexOf(vertB)

	let useReverseLookup, edgeId
	if (idxA < idxB) {
		useReverseLookup = false
		edgeId = `${vertA.id}${vertB.id}`
	} else {
		useReverseLookup = true
		edgeId = `${vertB.id}${vertA.id}`
	}

	const edge = edges.find(({ id }) => edgeId === id)

	if (typeof edge === "undefined") {
		debugger
	}

	return {
		useReverseLookup,
		edge
	}
}

function randomBetween(min, max) {
	let timeoutDuration = min
	const additionalDuration = Math.round(Math.random() * max)
	return timeoutDuration + additionalDuration
}

export default Projector

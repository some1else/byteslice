import React, { PureComponent } from "react"

import EdgeMix from "./EdgeMix"

import "./styles.css"

const MIX_MIN = 0
const MIX_MAX = 100

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
		mix: MIX_MIN + (MIX_MAX - MIX_MIN) / 2,
		lastMixed: new Date(),
		lastChanged: new Date()
	}

	componentDidMount() {
		const duration = randomBetween(
			CROSSFADE_INTERVALS[0],
			CROSSFADE_INTERVALS[1]
		)

		setTimeout(this.handleEventLoop, duration)
	}

	handleEventLoop = () => {
		const { lastChanged, vertA, vertB, mix } = this.state

		const now = new Date()
		const timeHasPassed = now.getTime() - lastChanged.getTime()

		const changeDuration = randomBetween(
			NEW_PAIR_INTERVALS[0],
			NEW_PAIR_INTERVALS[1]
		)

		const isMinMix = mix === MIX_MIN
		const isMaxMix = mix === MIX_MAX

		const mixOrPick =
			timeHasPassed < changeDuration
				? "mix"
				: isMinMix || isMaxMix
				? "pick"
				: "mix"

		if (mixOrPick === "mix") {
			// mix strategy
			const extremesOrBetweens =
				timeHasPassed > changeDuration ? "extremes" : "betweens"

			let newDesiredMix
			if (extremesOrBetweens === "extremes") {
				newDesiredMix = this.pickAorB()
			} else {
				newDesiredMix = this.pickMix()
			}

			this.setState({
				desiredMix: newDesiredMix,
				lastMixed: now
			})
		} else {
			// pick strategy
			const incomingVertex = this.pickNewVertex({
				excludeVertices: [vertA, vertB]
			})

			const newVertA = isMinMix ? vertA : incomingVertex
			const newVertB = isMaxMix ? vertB : incomingVertex
			const edgeInfo = getEdge(newVertA, newVertB) // { edge, useReverseLookup }

			this.setState({
				vertA: newVertA,
				vertB: newVertB,
				...edgeInfo,
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
		const { mix } = this.state

		const diffA = mix - MIX_MIN
		const diffB = mix - MIX_MAX

		let desiredMix

		if (diffA > diffB) {
			desiredMix = MIX_MAX
		} else {
			desiredMix = MIX_MIN
		}

		return desiredMix
	}

	randomVertex() {
		return vertices[Math.floor(Math.random() * 3)]
	}

	pickNewVertex({ excludeVertices }) {
		let incomingVertex = this.randomVertex()
		while (excludeVertices.indexOf(incomingVertex) > -1) {
			incomingVertex = this.randomVertex()
		}

		return incomingVertex
	}

	render() {
		const { edge, useReverseLookup, mix } = this.state

		const transformedMix = useReverseLookup ? mix : MIX_MAX - mix

		return (
			<div className="Projector">
				<EdgeMix edgeId={edge && edge.id} mix={transformedMix} />
			</div>
		)
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

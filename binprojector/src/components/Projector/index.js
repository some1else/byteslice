import React, { PureComponent } from "react"

import EdgeMix from "./EdgeMix"

import { STEPS } from "../../App"

import "./styles.css"

const MIX_MIN = 0
const MIX_MAX = 50

const CROSSFADE_INTERVALS = [64, 192]
const NEW_PAIR_INTERVALS = [1024, 2048]

class Projector extends PureComponent {
	state = {
		vertA: this.props.vertices[0],
		vertB: this.props.vertices[1],
		edge: this.props.edges[0],
		useReverseLookup: false,
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
		const { edges, vertices } = this.props
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

			let newMix
			if (extremesOrBetweens === "extremes") {
				newMix = this.pickExtremeMix()
			} else {
				newMix = this.pickMix()
			}

			this.setState({
				mix: newMix,
				lastMixed: now
			})
		} else {
			// pick strategy
			const remainingVertex = isMinMix ? vertA : isMaxMix ? vertB : null
			const excludeVertex = isMinMix ? vertB : isMaxMix ? vertA : null

			if (remainingVertex === null || excludeVertex === null) {
				debugger
			}

			const incomingVertex = this.pickNewVertex({
				excludeVertices: [excludeVertex],
				includeVertex: remainingVertex
			})

			const newVertA = isMinMix ? vertA : incomingVertex
			const newVertB = isMaxMix ? vertB : incomingVertex

			const { edge, useReverseLookup } = getEdge(
				vertices,
				edges,
				newVertA.id,
				newVertB.id
			)

			this.setState({
				vertA: newVertA,
				vertB: newVertB,
				edge,
				useReverseLookup,
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

	pickExtremeMix() {
		const { mix } = this.state

		const diffA = mix - MIX_MIN
		const diffB = MIX_MAX - mix

		let newMix
		// move to whichever is closer
		if (diffA > diffB) {
			newMix = MIX_MAX
		} else {
			newMix = MIX_MIN
		}

		return newMix
	}

	randomVertex(excludeVertexIds = []) {
		const { vertices } = this.props
		const verticesLength = vertices.length
		const randomIndex = () => Math.floor(Math.random() * verticesLength)
		let randomVertex = vertices[randomIndex()]
		while (excludeVertexIds.indexOf(randomVertex.id) > -1) {
			randomVertex = vertices[randomIndex()]
		}
		return randomVertex
	}

	pickNewVertex({ excludeVertices, includeVertex }) {
		const { vertices, edges } = this.props

		const excludeVertexIds = excludeVertices
			.map(vert => vert.id)
			.concat(includeVertex.id)

		let incomingVertex = this.randomVertex(excludeVertexIds)

		while (!getEdge(vertices, edges, includeVertex.id, incomingVertex.id)) {
			// keep picking new random vertex
			incomingVertex = this.randomVertex(excludeVertexIds)
		}

		return incomingVertex
	}

	render() {
		const { edge, useReverseLookup, mix } = this.state
		const { id: edgeId } = edge || {}

		const transformedMix = useReverseLookup ? mix : MIX_MAX - mix

		return (
			<div className="Projector">
				<EdgeMix edgeId={edgeId} mix={transformedMix} />
			</div>
		)
	}
}

function getEdge(vertices, edges, vertAId, vertBId) {
	const vertA = vertices.find(vert => vert.id === vertAId)
	const vertB = vertices.find(vert => vert.id === vertBId)
	const idxA = vertices.indexOf(vertA)
	const idxB = vertices.indexOf(vertB)

	if (typeof vertA === "undefined" || typeof vertB === "undefined") {
		debugger
	}

	let useReverseLookup, edgeId
	if (idxA < idxB) {
		useReverseLookup = false
		edgeId = `${vertA.id}.${vertB.id}`
	} else {
		useReverseLookup = true
		edgeId = `${vertB.id}.${vertA.id}`
	}

	const edge = edges.find(({ id }) => edgeId === id)

	if (typeof edge === "undefined") {
		debugger
		return false
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

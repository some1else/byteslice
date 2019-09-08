import React, { PureComponent } from "react"

import EdgeMix from "./EdgeMix"

import "./styles.css"

const MIX_MIN = 0
const MIX_MAX = 50

const CROSSFADE_INTERVALS = [64 * 1, 1 * 192]
const NEW_PAIR_INTERVALS = [1024 * 1, 1 * 2048]

class Projector extends PureComponent {
	state = {
		vertA: this.props.vertices.find(({ id }) => parseInt(id) === 1),
		vertB: this.props.vertices.find(({ id }) => parseInt(id) === 2),
		edge: this.props.edges.find(({ id }) => parseInt(id) === 1),
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
		const { edges, vertices, onMixChanged, onEdgeChanged } = this.props
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
				throw new Error("Alo")
			}

			const incomingVertex = this.pickNewVertex({
				excludeVertices: [excludeVertex],
				includeVertex: remainingVertex
			})

			const newVertA = isMinMix ? vertA : incomingVertex
			const newVertB = isMaxMix ? vertB : incomingVertex

			const edge = getEdge2(vertices, edges, newVertA, newVertB)

			// const isConnected = connectsVertices(edge, newVertA, newVertB)

			this.setState({
				vertA: newVertA,
				vertB: newVertB,
				edge,
				lastMixed: now,
				lastChanged: now
			})

			onEdgeChanged && onEdgeChanged({ edge })
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

	randomVertex(excludeVertexIds = [], filterCond = v => true) {
		const { vertices } = this.props
		const verticesLength = vertices.length
		const randomIndex = () => Math.floor(Math.random() * verticesLength)
		let randomVertex = vertices[randomIndex()]
		while (
			excludeVertexIds.indexOf(randomVertex.id) > -1 ||
			!filterCond(randomVertex)
		) {
			randomVertex = vertices[randomIndex()]
		}
		return randomVertex
	}

	pickNewVertex({ excludeVertices, includeVertex }) {
		const { vertices, edges } = this.props

		const excludeVertexIds = excludeVertices
			.map(vert => vert.id)
			.concat(includeVertex.id)

		const connectCondition = vertex => {
			const connectingEdge = edges.find(edge =>
				connectsVertices(edge, includeVertex, vertex)
			)
			return !!connectingEdge
		}

		let incomingVertex = this.randomVertex(excludeVertexIds, connectCondition)

		while (!getEdge2(vertices, edges, includeVertex, incomingVertex)) {
			// keep picking new random vertex
			incomingVertex = this.randomVertex(excludeVertexIds, connectCondition)
		}

		return incomingVertex
	}

	render() {
		const { edge, mix } = this.state
		const { edges, vertices, onMixChanged } = this.props

		return (
			<div className="Projector">
				<EdgeMix
					edge={edge}
					edges={edges}
					vertices={vertices}
					mix={mix}
					onMixChanged={onMixChanged}
				/>
			</div>
		)
	}
}

function connectsVertices(edge, vertA, vertB) {
	return (edge.source === vertA.id && edge.target === vertB.id) ||
		(edge.source === vertB.id && edge.target === vertA.id)
		? true
		: false
}

function getEdge2(vertices, edges, vertA, vertB) {
	const edge = edges.find(edge => connectsVertices(edge, vertA, vertB))
	return edge
}

function randomBetween(min, max) {
	let timeoutDuration = min
	const additionalDuration = Math.round(Math.random() * max)
	return timeoutDuration + additionalDuration
}

export default Projector

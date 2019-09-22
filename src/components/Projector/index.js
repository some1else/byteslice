import React, { PureComponent } from "react"

import EdgeMix from "./EdgeMix"
import ImagePreloader from "../ImagePreloader"

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
		lastChanged: new Date(),
		lastVisitedMap: {},
		loadedEdgeMap: {},
		loadedEdges: [],
	}

	componentDidMount() {
		const duration = randomBetween(
			CROSSFADE_INTERVALS[0],
			CROSSFADE_INTERVALS[1],
		)

		setTimeout(this.handleEventLoop, duration)
	}

	handleImageLoaded = (edgeId) => {
		const { loadedEdgeMap, loadedEdges } = this.state
		const isEdgeLoaded = loadedEdges.find((id) => id === edgeId)

		if (isEdgeLoaded) return false

		const loadCount = loadedEdgeMap[edgeId] || 0
		const didEdgeLoad = loadCount >= 50

		this.setState({
			loadedEdges: didEdgeLoad ? [...loadedEdges, edgeId] : loadedEdges,
			loadedEdgeMap: {
				...loadedEdgeMap,
				[edgeId]: loadCount + 1,
			},
		})
	}

	handleEventLoop = () => {
		const { edges, onEdgeChanged } = this.props
		const {
			lastChanged,
			vertA,
			vertB,
			mix,
			edge: prevEdge,
			lastVisitedMap,
		} = this.state

		const now = new Date()
		const timeHasPassed = now.getTime() - lastChanged.getTime()

		const changeDuration = randomBetween(
			NEW_PAIR_INTERVALS[0],
			NEW_PAIR_INTERVALS[1],
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
				lastMixed: now,
			})
		} else {
			// pick strategy
			const remainingVertex = isMinMix ? vertA : isMaxMix ? vertB : null
			const excludeVertex = isMinMix ? vertB : isMaxMix ? vertA : null

			if (remainingVertex === null || excludeVertex === null) {
				debugger
				throw new Error("No remaining or excluded vertices")
			}

			const incomingVertex = this.pickNewVertex({
				excludeVertex: excludeVertex,
				includeVertex: remainingVertex,
			})

			if (!incomingVertex) {
				this.setState({
					lastChanged: now,
					lastMixed: now,
				})

				const duration = randomBetween(
					CROSSFADE_INTERVALS[0],
					CROSSFADE_INTERVALS[1],
				)

				setTimeout(this.handleEventLoop, duration)

				return false
			}

			const newVertA = isMinMix ? vertA : incomingVertex
			const newVertB = isMaxMix ? vertB : incomingVertex

			if (!edges || !newVertA || !newVertB) {
				debugger
				throw new Error("No edges or new vertices")
			}

			const edge = getConnectingEdge(edges, newVertA, newVertB)

			if (!edge) {
				debugger
				throw new Error("No connecting edge")
			}

			const ts = new Date()

			const newLastVisitedMap = {
				...lastVisitedMap,
				[edge.id]: ts,
			}

			this.setState({
				vertA: newVertA,
				vertB: newVertB,
				edge,
				prevEdge,
				lastMixed: now,
				lastChanged: now,
				lastVisitedMap: newLastVisitedMap,
			})

			onEdgeChanged && onEdgeChanged({ edge })
		}

		const duration = randomBetween(
			CROSSFADE_INTERVALS[0],
			CROSSFADE_INTERVALS[1],
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

	pickNewVertex({ excludeVertex, includeVertex }) {
		const { vertices, edges } = this.props
		const { lastVisitedMap, loadedEdges } = this.state

		const neighboringEdges = edges.filter(
			(e) =>
				(e.source === includeVertex.id || e.target === includeVertex.id) &&
				(e.source !== excludeVertex.id && e.target !== excludeVertex.id) &&
				loadedEdges.indexOf(e.id) > -1,
		)

		const candidateEdges = neighboringEdges.sort((edgeA, edgeB) => {
			const aVisit = lastVisitedMap[edgeA.id]
			const aTime = aVisit ? aVisit.getTime() : Number.NEGATIVE_INFINITY
			const bVisit = lastVisitedMap[edgeB.id]
			const bTime = bVisit ? bVisit.getTime() : Number.NEGATIVE_INFINITY
			return aTime - bTime
		})

		if (candidateEdges.length === 0) {
			return false
		}

		const freshEdges = candidateEdges.filter((e) => !lastVisitedMap[e])

		let newVertId

		if (freshEdges.length > 0) {
			const freshEdge = freshEdges[0]
			newVertId =
				freshEdge.source !== excludeVertex.id &&
				freshEdge.source !== includeVertex.id
					? freshEdge.source
					: freshEdge.target
		} else {
			const staleEdge = candidateEdges[0]
			newVertId =
				staleEdge.source !== excludeVertex.id &&
				staleEdge.source !== includeVertex.id
					? staleEdge.source
					: staleEdge.target
		}

		return vertices.find((v) => v.id === newVertId)
	}

	render() {
		const { edge, prevEdge, mix, loadedEdges } = this.state
		const { edges, vertices, onMixChanged } = this.props

		return (
			<div className="Projector">
				{loadedEdges < 3 ? (
					<p>Preloading</p>
				) : (
					<EdgeMix
						edge={edge}
						prevEdge={prevEdge}
						edges={edges}
						vertices={vertices}
						mix={mix}
						onMixChanged={onMixChanged}
					/>
				)}
				<ImagePreloader
					edges={edges}
					vertices={vertices}
					edge={edge}
					onImageLoaded={this.handleImageLoaded}
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

function getConnectingEdge(edges, vertA, vertB) {
	const edge = edges.find((edge) => connectsVertices(edge, vertA, vertB))
	return edge
}

function randomBetween(min, max) {
	let timeoutDuration = min
	const additionalDuration = Math.round(Math.random() * max)
	return timeoutDuration + additionalDuration
}

export default Projector

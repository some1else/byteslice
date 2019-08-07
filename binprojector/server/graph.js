var edgeAB = {
	id: "ab",
	from: "a",
	to: "b"
}

var edgeAC = {
	id: "ac",
	from: "a",
	to: "c"
}

var edgeAE = {
	id: "ae",
	from: "a",
	to: "e"
}

var edgeBC = {
	id: "bc",
	from: "b",
	to: "c"
}

var edgeCD = {
	id: "cd",
	from: "c",
	to: "d"
}

var edgeDE = {
	id: "de",
	from: "d",
	to: "e"
}

var vertA = {
	id: "a",
	edges: ["ab", "ae"]
}

var vertB = {
	id: "b",
	edges: ["ab", "bc"]
}

var vertC = {
	id: "c",
	edges: ["bc", "cd"]
}

var vertD = {
	id: "d",
	edges: ["cd", "de"]
}

var vertE = {
	id: "e",
	edges: ["de", "ae"]
}

// pentagon
var complexGraph = {
	edges: [edgeAB, edgeAE, edgeBC, edgeCD, edgeDE],
	vertices: [vertA, vertB, vertC, vertD, vertE]
}

// triangle
var simpleGraph = {
	edges: [edgeAB, edgeAC, edgeBC],
	vertices: [vertA, vertB, vertC]
}
// triangle2
var simpleGraph2 = {
	...simpleGraph,
	vertices: [
		{ ...vertA, edges: ["ab", "ac"] },
		{ ...vertB, edges: ["ab", "bc"] },
		{ ...vertC, edges: ["bc", "ac"] }
	]
}

// function serialize(graph) {
//   const newGraph = {}
//   newGraph.edges = graph.edges.map(edge => edge.id)
//   newGraph.vertices = graph.vertices.map(vertex => vertex.id)
//   return newGraph
// }

function generateGraph() {
	const vertices = ["a.jpg", "b.jpg", "c.jpg", "d.jpg"]
	const edges = []
	for (var i = 0; i < vertices.length; i++) {
		for (var j = i + 1; j < vertices.length; j++) {
			const edge = vertices[i] + "." + vertices[j]
			edges.push(edge)
		}
	}
	return {
		vertices: vertices.map(v => ({ id: v })),
		edges: edges.map(e => ({ id: e }))
	}
}

const generatedGraph = generateGraph()

module.exports = generatedGraph

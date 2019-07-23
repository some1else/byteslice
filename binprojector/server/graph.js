var edgeAB = {
  id: "AB",
  from: "A",
  to: "B"
}

var edgeAC = {
  id: "AC",
  from: "A",
  to: "C"
}

var edgeAE = {
  id: "AE",
  from: "A",
  to: "E"
}

var edgeBC = {
  id: "BC",
  from: "B",
  to: "C"
}

var edgeCD = {
  id: "CD",
  from: "C",
  to: "D"
}

var edgeDE = {
  id: "DE",
  from: "D",
  to: "E"
}

var vertA = {
  id: "A",
  edges: ["AB", "AE"]
}

var vertB = {
  id: "B",
  edges: ["AB", "BC"]
}

var vertC = {
  id: "C",
  edges: ["BC", "CD"]
}

var vertD = {
  id: "D",
  edges: ["CD", "DE"]
}

var vertE = {
  id: "E",
  edges: ["DE", "AE"]
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
    { ...vertA, edges: ["AB", "AC"] },
    { ...vertB, edges: ["AB", "BC"] },
    { ...vertC, edges: ["BC", "AC"] }
  ]
}

// function serialize(graph) {
//   const newGraph = {}
//   newGraph.edges = graph.edges.map(edge => edge.id)
//   newGraph.vertices = graph.vertices.map(vertex => vertex.id)
//   return newGraph
// }

module.exports = simpleGraph2

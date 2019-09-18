const MAX_EDGES = 6
const MAX_ID = 812819

const SEED_DATA = require("../files/seedData.json")

const ids = {
  edges: SEED_DATA.edges.reduce(
    (maxId, edge) => (edge.id > maxId ? edge.id : maxId),
    0
  ),
  vertices: SEED_DATA.vertices.reduce(
    (maxId, vert) => (vert.id > maxId ? vert.id : maxId),
    0
  )
}

function getNewId(scope) {
  const newId = ids[scope] + 1
  ids[scope] = newId
  return newId
}

function grow(graph, data = {}) {
  const { graph: grownGraph, newEdges: grownEdges } = addNewVertex(graph, data)
  const { graph: sanitizedGraph, newEdges: sanitizedEdges } = sanitizeGraph(
    grownGraph
  )
  return {
    graph: sanitizedGraph,
    newEdges: [...grownEdges, ...sanitizedEdges]
  }
}

function logGraph(graph) {
  const string = JSON.stringify(graph)
  console.log(string)
}

function findWeakestEdge(edges, excludeEdges = []) {
  let weakest = null
  let min = Number.POSITIVE_INFINITY

  edges
    .filter(edge => excludeEdges.indexOf(edge) === -1)
    .filter(edge => !edge.closed)
    .forEach(edge => {
      const sum = edge.source + edge.target
      if (sum < min) {
        min = sum
        weakest = edge
      } else if (sum === min) {
        if (
          Math.min(edge.source, edge.target) <
          Math.min(weakest.source, weakest.target)
        ) {
          min = sum
          weakest = edge
        }
      }
    })

  return weakest
}

function createVertex({ edges = [], data = {}, id: newId }) {
  const id = newId || getNewId("vertices")
  return { id, edges, data }
}

function createEdge({ source, target, id: newId }) {
  const id = newId || getNewId("edges")
  return { id, source, target, weight: source + target }
}

function addNewVertex({ edges, vertices }, data = {}) {
  const dataVerticesCount = vertices.filter(v => v.data).length
  if (vertices.length === 3 && dataVerticesCount < 3) {
    const vert = vertices.find(vert => !vert.data)
    vert.data = { ...data }
    const remainVertices = vertices.filter(v => v != vert)

    if (dataVerticesCount + 1 === 1) {
      return {
        graph: {
          edges: [...edges],
          vertices: [...remainVertices, vert]
        },
        newEdges: []
      }
    } else if (dataVerticesCount + 1 === 2) {
      return {
        graph: {
          edges: [...edges],
          vertices: [...remainVertices, vert]
        },
        newEdges: [findById(edges, 1)]
      }
    } else if (dataVerticesCount + 1 === 3) {
      return {
        graph: {
          edges: [...edges],
          vertices: [...remainVertices, vert]
        },
        newEdges: [findById(edges, 2), findById(edges, 3)]
      }
    }
  }

  const edge = findWeakestEdge(edges)

  const { source: vertAId, target: vertBId } = edge

  const vertA = findById(vertices, vertAId)
  const vertB = findById(vertices, vertBId)

  const newVertex = createVertex({ data })

  const newEdgeA = createEdge({
    source: vertAId,
    target: newVertex.id
  })

  const newEdgeB = createEdge({
    source: newVertex.id,
    target: vertBId
  })

  newVertex.edges = [newEdgeA.id, newEdgeB.id]

  const remainEdges = edges.filter(l => l !== edge)
  const remainVertices = vertices.filter(v => v !== vertA && v !== vertB)

  vertA.edges = [...vertA.edges, newEdgeA.id]
  vertB.edges = [...vertB.edges, newEdgeB.id]

  edge.closed = true

  return {
    graph: {
      edges: [...remainEdges, edge, newEdgeA, newEdgeB],
      vertices: [...remainVertices, vertA, vertB, newVertex]
    },
    newEdges: [newEdgeA, newEdgeB]
  }
}

function updateVertex({ edges, vertices }, oldVert, data = {}) {
  const remainVertices = vertices.filter(v => v.id !== oldVert.id)
  const vertEdges = oldVert.edges.map(id => findById(edges, id))
  const remainEdges = edges.filter(e => oldVert.edges.indexOf(e.id) === -1)
  const newEdges = vertEdges.map(edge => {
    const { isCorrupted, isRendered, ...rest } = edge
    return rest
  })

  const newVertex = {
    id: oldVert.id,
    edges: newEdges.map(e => e.id),
    data
  }

  const graph = {
    edges: [...remainEdges, ...newEdges],
    vertices: [...remainVertices, newVertex]
  }

  return { graph, newEdges }
}

function sanitizeGraph(graph) {
  debugger

  // if (graph.vertices.length < 4) return { graph: { ...graph }, newEdges: [] }

  const looseEdges = []
  let newEdges = []
  let done = false

  while (!done) {
    const edge = findWeakestEdge(graph.edges, looseEdges)
    const sourceVert = findById(graph.vertices, edge.source)
    const targetVert = findById(graph.vertices, edge.target)
    if (sourceVert.edges.length === MAX_EDGES) {
      const { graph: closedSourceGraph, newEdge } = closeLastEdgeWithSource(
        graph,
        edge,
        sourceVert,
        targetVert
      )
      graph = closedSourceGraph
      newEdges = [...newEdges, newEdge]
    } else if (targetVert.edges.length === MAX_EDGES) {
      const { graph: closedTargetGraph, newEdge } = closeLastEdgeWithTarget(
        graph,
        edge,
        targetVert,
        sourceVert
      )
      graph = closedTargetGraph
      newEdges = [...newEdges, newEdge]
    } else {
      done = true
    }
  }

  return { graph: { ...graph }, newEdges }
}

function closeLastEdgeWithTarget(
  { edges, vertices },
  edge,
  targetVert,
  sourceVert
) {
  edge.closed = true

  // find strongest edge connected to the targetVert
  let targetEdge
  let max = Number.NEGATIVE_INFINITY
  const targetEdges = edges.filter(e => targetVert.edges.indexOf(e.id) > -1)
  targetEdges.forEach(thisEdge => {
    const sum = thisEdge.source + thisEdge.target
    if (sum > max && thisEdge !== edge) {
      targetEdge = thisEdge
      max = sum
    }
  })
  targetEdge.closed = true

  const siblingVert = findById(vertices, targetEdge.target)

  const newEdge = createEdge({
    target: siblingVert.id,
    source: sourceVert.id
  })
  siblingVert.edges = [...siblingVert.edges, newEdge.id]
  sourceVert.edges = [...sourceVert.edges, newEdge.id]

  const remainEdges = edges.filter(e => [edge, targetEdge].indexOf(e) === -1)
  const remainVertices = vertices.filter(
    v => [siblingVert, sourceVert].indexOf(v) === -1
  )

  return {
    graph: {
      edges: [...remainEdges, edge, targetEdge, newEdge],
      vertices: [...remainVertices, sourceVert, siblingVert]
    },
    newEdge
  }
}

function closeLastEdgeWithSource(
  { edges, vertices },
  edge,
  sourceVert,
  targetVert
) {
  edge.closed = true

  // foind strongest edge connected to sourceVert
  let sourceEdge
  let max = Number.NEGATIVE_INFINITY
  const sourceEdges = edges.filter(e => sourceVert.edges.indexOf(e.id) > -1)
  sourceEdges.forEach(edge => {
    const sum = edge.source + edge.target
    if (sum > max) {
      sourceEdge = edge
      max = sum
    }
  })

  sourceEdge.closed = true

  const siblingVert = findById(vertices, sourceEdge.source)

  const newEdge = createEdge({
    source: siblingVert.id,
    target: targetVert.id
  })

  siblingVert.edges = [...siblingVert.edges, newEdge.id]
  targetVert.edges = [...targetVert.edges, newEdge.id]

  const remainEdges = edges.filter(e => [edge, sourceEdge].indexOf(e) === -1)
  const remainVertices = vertices.filter(
    v => [siblingVert, targetVert].indexOf(v) === -1
  )

  return {
    graph: {
      edges: [...remainEdges, edge, sourceEdge, newEdge],
      vertices: [...remainVertices, targetVert, siblingVert]
    },
    newEdge
  }
}

function findById(collection, targetId) {
  return collection.find(({ id }) => id === targetId)
}

function updateEdge({ edges, vertices }, id, mutFunc) {
  const edge = edges.find(e => e.id === parseInt(id))
  if (edge && mutFunc) {
    const remainEdges = edges.filter(e => e !== edge)
    return {
      edges: [...remainEdges, mutFunc(edge)],
      vertices
    }
  } else {
    return { edges, vertices }
  }
}

function removeEdges({ edges, vertices }, cond) {
  const removeEdges = edges.filter(cond)
  const remainEdges = edges.filter(e => !cond(e))
  const cleanedVertices = vertices.map(vert => {
    const remainVertEdges = vert.edges.filter(id =>
      remainEdges.find(e => e.id === id)
    )
    return {
      ...vert,
      edges: remainVertEdges
    }
  })

  return {
    edges: remainEdges,
    vertices: cleanedVertices
  }
}

function findCorruptVertices({ edges, vertices }) {
  const corruptVertices = vertices.filter(vert => {
    const corruptEdges = vert.edges.filter(id => {
      const edge = edges.find(e => e.id === id)
      if (typeof edge === "undefined") {
        return true
      } else {
        return edge.isCorrupted
      }
    })
    return corruptEdges.length >= 2
  })

  return corruptVertices
}

function findLooseEdges({ edges, vertices }) {
  if (edges.length === 0) return 0

  const looseEdges = []
  let done = false

  while (!done) {
    const weakestEdge = findWeakestEdge(edges, looseEdges)
    const sourceVert = findById(vertices, weakestEdge.source)
    const targetVert = findById(vertices, weakestEdge.target)
    const isLooseEnd =
      sourceVert.edges.length === MAX_EDGES ||
      targetVert.edges.length === MAX_EDGES
    if (isLooseEnd) {
      looseEdges.push(weakestEdge)
    } else {
      done = true
    }
  }

  return looseEdges
}

module.exports = {
  MAX_ID,
  SEED_DATA,
  getNewId,
  grow,
  logGraph,
  findWeakestEdge,
  createVertex,
  createEdge,
  addNewVertex,
  updateVertex,
  sanitizeGraph,
  closeLastEdgeWithTarget,
  closeLastEdgeWithSource,
  findById,
  findCorruptVertices,
  findLooseEdges,
  updateEdge,
  removeEdges
}

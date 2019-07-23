const express = require("express")
let graph = require("./graph.js")

let app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000") // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

app.get("/", (req, res) => res.send("200 OK"))

app.get("/slice/:a/:b/:amount", (req, res) => {
  const { a, b, amount } = req.params
  const resultImage = generateImage(a, b, amount)
  res.send(resultImage)
})

app.get("/update", (req, res) => {
  // graph = mutate(graph)
  res.send(JSON.stringify(graph))
})

function mutate(graph) {
  let newGraph = graph

  const addOrRemove = Math.random() > 0.5 ? "add" : "remove"

  switch (addOrRemove) {
    case "add":
      const newChild = createChild()
      newGraph = appendChild(newGraph, newChild)
      break
    case "remove":
      const removeId = randomEdgeId(newGraph)
      newGraph = removeEdge(newGraph, removeId)
      break
  }

  return newGraph
}

function createChild() {
  return {
    id: null
  }
}

function appendChild(graph, child) {
  return graph
}

function randomEdgeId(graph) {
  return graph.edges[0]
}

function removeEdge(graph) {
  return graph
}

function generateImage(a, b, amount) {
  return {}
}

app.listen(3001, () => {
  console.log("Listening on port 3001")
})

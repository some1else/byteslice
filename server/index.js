const fs = require("fs")
const path = require("path")

const express = require("express")
const Queue = require("bee-queue")

const queueConf = require("./queue.config.js")

const scrapeQueue = new Queue("scrape", queueConf)
const sliceQueue = new Queue("slice", queueConf)

const g2 = require("./graph2.js")

let app = express()

let data
try {
  data = require("../files/currentData.json")
} catch (e) {
  data = require("./seedData.json")
}
console.log("Loaded graph.")

function updateData(newData) {
  data = newData
  fs.writeFile("files/currentData.json", JSON.stringify(data), "utf8", () => {
    console.log("Wrote graph")
  })
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000") // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

app.get("/count", (req, res) => {
  res.send(data.vertices.length.toString())
})

app.get("/run", (req, res) => {
  const randomId = Math.floor(
    (g2.MAX_ID / 100) * 99.8 +
      Math.floor(Math.random() * ((g2.MAX_ID / 100) * 0.2))
  )

  const job = scrapeQueue.createJob({ randomId })
  job.save(function(err, job) {
    if (err) {
      console.error("Job failed to save", job.data)
      return res.send("Job failed to save", job.id)
    }
    console.log("Saved job", job.id, job.data)
  })

  res.send(JSON.stringify(job.data))
})

app.get("/g2/add", (req, res) => {
  const { file, camId } = req.query
  console.log("Growing graph", file, camId)

  const corruptVertices = g2.findCorruptVertices(data)
  console.warn("Potentially corrupt vertices:", corruptVertices.map(v => v.id))

  if (corruptVertices.length > 0) {
    // replace corrupt vertex
    const corruptVert = corruptVertices[0]
    const { graph, newEdges } = g2.updateVertex(data, corruptVert, {
      file,
      camId
    })
    updateData(graph)
    newEdges.forEach(createSliceJob)
    res.send(JSON.stringify({ graph, newEdges }))
  } else {
    // add new vert
    const { graph, newEdges } = g2.grow(data, { file, camId })
    updateData(graph)
    newEdges.forEach(createSliceJob)
    res.send(JSON.stringify({ graph, newEdges }))
  }
})

function createSliceJob(edge) {
  const sourceVert = g2.findById(data.vertices, edge.source)
  const targetVert = g2.findById(data.vertices, edge.target)
  const job = sliceQueue.createJob({ edge, sourceVert, targetVert })
  job.save(function(err, job) {
    if (err) {
      console.error("Job failed to save", job.data)
      return res.send("Job failed to save", job.id)
    }
    console.log("Saved job", job.id, job.data)
  })
}

app.get("/g2/edges/:id/isRendered", (req, res) => {
  const { id } = req.params
  const graph = g2.updateEdge(data, id, e => ({ ...e, isRendered: true }))
  updateData(graph)
  res.sendStatus(200)
})

app.get("/g2/edges/:id/isCorrupted", (req, res) => {
  const { id } = req.params
  const graph = g2.updateEdge(data, id, e => ({ ...e, isCorrupted: true }))
  updateData(graph)
  res.sendStatus(200)
})

app.get("/g2/data", (req, res) => {
  res.send(JSON.stringify({ edges: data.edges, vertices: data.vertices }))
})

app.get("/g2/projector", (req, res) => {
  const cleanGraph = g2.removeEdges(data, edge => !edge.isRendered)

  res.send(JSON.stringify(cleanGraph))
})

app.listen(3001, () => {
  console.log("Listening on port 3001")
})

app.get("/sliced/:name", function(req, res, next) {
  var options = {
    root: path.join(__dirname, "../files/sliced"),
    dotfiles: "deny",
    headers: {
      "x-sent": true
    }
  }

  var fileName = req.params.name

  res.sendFile(fileName, options, function(err) {
    if (err) {
      next(err)
    } else {
      // console.log("Sent:", fileName)
    }
  })
})

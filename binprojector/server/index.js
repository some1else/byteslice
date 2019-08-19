var fs = require("fs")

const express = require("express")
const Queue = require("bee-queue")

const scrapeQueue = new Queue("scrape")
const sliceQueue = new Queue("slice")

const g2 = require("./graph2.js")

let app = express()

// let data = g2.SEED_DATA
let data = require("./currentData.json")

const MAX_ID = 808988

function updateData(newData) {
  data = newData
  fs.writeFile("server/currentData.json", JSON.stringify(data), "utf8", () => {
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

app.get("/", (req, res) => {
  const randomId = Math.floor(
    (MAX_ID / 100) * 99.8 + Math.floor(Math.random() * ((MAX_ID / 100) * 0.2))
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
  console.log("they want us to grow", file, camId)
  const { graph, newEdges } = g2.grow(data, { file, camId })
  updateData(graph)
  newEdges.forEach(edge => {
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
  })
  res.send(JSON.stringify({ graph, newEdges }))
})

app.get("/g2/edges/:id/isRendered", (req, res) => {
  const { id } = req.params
  const graph = g2.updateEdge(data, id, e => ({ ...e, isRendered: true }))
  updateData(graph)
  res.send(200)
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

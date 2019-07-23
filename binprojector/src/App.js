import React, { Component } from "react"
import "./App.css"

import Projector from "./components/Projector"
import ImagePreloader from "./components/ImagePreloader"

class App extends Component {
	async componentDidMount() {
		const resp = await fetch("http://localhost:3001/update")
		const graph = await resp.json()
		console.log(graph)
	}

	render() {
		return (
			<div className="App">
				<Projector />
				<ImagePreloader />
			</div>
		)
	}
}

export default App

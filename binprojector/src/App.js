import React, { Component } from "react"
import "./App.css"

import Projector from "./components/Projector"
import ImagePreloader from "./components/ImagePreloader"

class App extends Component {
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

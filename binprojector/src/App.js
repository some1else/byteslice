import React, { Fragment, PureComponent } from "react"
import "./App.css"

import Projector from "./components/Projector"
import ImagePreloader from "./components/ImagePreloader"
import GraphData from "./components/Projector/GraphData"

export const BASEPATH = "/sliced"
export const EXT = "jpg"
export const STEPS = 50

class App extends PureComponent {
	render() {
		return (
			<div className="App">
				<GraphData>
					{({ edges, vertices }) => (
						<Fragment>
							<Projector edges={edges} vertices={vertices} />
							<ImagePreloader edges={edges} vertices={vertices} />
						</Fragment>
					)}
				</GraphData>
			</div>
		)
	}
}

export default App

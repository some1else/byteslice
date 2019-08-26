import React, { Fragment, PureComponent } from "react"
import "./App.css"

import Projector from "./components/Projector"
import ImagePreloader from "./components/ImagePreloader"
import GraphData from "./components/Projector/GraphData"

export const BASEPATH = "/sliced"
export const EXT = "jpg"
export const STEPS = 50

class App extends PureComponent {
	state = {
		hasPreloadedImages: false
	}

	onPreloaded = () => {
		this.setState({ hasPreloadedImages: true })
	}
	render() {
		const { hasPreloadedImages } = this.state
		return (
			<div className="App">
				<GraphData>
					{({ edges, vertices }) => (
						<Fragment>
							{hasPreloadedImages && (
								<Projector edges={edges} vertices={vertices} />
							)}
							<ImagePreloader
								edges={edges}
								vertices={vertices}
								onPreloaded={this.onPreloaded}
							/>
						</Fragment>
					)}
				</GraphData>
			</div>
		)
	}
}

export default App

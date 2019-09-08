import React, { PureComponent, Fragment } from "react"
import WebMidi from "webmidi"

import Projector from "./components/Projector"
import ImagePreloader from "./components/ImagePreloader"
import GraphData from "./components/Projector/GraphData"

import "./App.css"

export const BASEPATH = "/sliced"
export const EXT = "jpg"
export const STEPS = 50

class App extends PureComponent {
	state = {
		edge: null,
		mix: null,
	}

	onEdgeChanged = ({ edge }) => {
		this.setState({ edge })
	}

	onMixChanged = (mix) => {
		this.setState({ mix })
		this.midiOut &&
			this.midiOut.sendControlChange(
				"modulationwheelfine",
				Math.floor((mix / STEPS) * 127),
				1,
			)
	}

	componentWillMount() {
		WebMidi.enable((err) => {
			if (!err) {
				this.midiOut = WebMidi.getOutputByName("ByteSliceMix")
			}
		})
	}

	render() {
		const { edge } = this.state
		return (
			<div className="App">
				<GraphData>
					{({ edges, vertices }) => (
						<Fragment>
							<Projector
								edges={edges}
								vertices={vertices}
								onEdgeChanged={this.onEdgeChanged}
								onMixChanged={this.onMixChanged}
							/>
							{edge && (
								<ImagePreloader
									edges={edges}
									vertices={vertices}
									edge={edge}
								/>
							)}
						</Fragment>
					)}
				</GraphData>
			</div>
		)
	}
}

export default App

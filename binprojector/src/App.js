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
		if (this.midiOut) {
			const textureA = edge.source % 12
			const textureB = edge.target % 12
			this.midiOut
				.playNote(textureA + 60, "all")
				.stopNote(textureA + 60, "all", { time: 100 })
			this.midiOut
				.playNote(textureB + 72, "all")
				.stopNote(textureB + 72, "all", { time: 100 })
		}
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
				if (this.midiOut) {
					this.midiOut
						.playNote(60, "all")
						.stopNote(60, "all", { time: 100 })
					this.midiOut
						.playNote(72, "all")
						.stopNote(72, "all", { time: 100 })
				}
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

							<ImagePreloader
								edges={edges}
								vertices={vertices}
								edge={edge}
							/>
						</Fragment>
					)}
				</GraphData>
			</div>
		)
	}
}

export default App

import React, { PureComponent, Fragment } from "react"
import WebMidi from "webmidi"
import { Howler, Howl } from "howler"

import Projector from "./components/Projector"
import GraphData from "./components/Projector/GraphData"
import AudioPlayer from "./components/AudioPlayer"

import "./App.css"

const SERVER_HOST = process.env.SERVER_HOST || "localhost:3001"
export const BASEPATH = `http://${SERVER_HOST}/sliced`
export const EXT = "jpg"
export const STEPS = 50

const isAudioEnabled = process.env.REACT_APP_AUDIO_ENABLED === "true"
const isMIDIEnabled = process.env.REACT_APP_MIDI_ENABLED === "true"

class App extends PureComponent {
	state = {
		edge: null,
		mix: null,
	}

	onEdgeChanged = ({ edge }) => {
		this.setState({ edge })
		if (isMIDIEnabled && this.midiOut) {
			const textureA = edge.source % 12
			const textureB = edge.target % 12

			this.midiOut
				.playNote(textureA + 60 + 12, "all")
				.stopNote(textureA + 60 + 12, "all", { time: 100 })
			this.midiOut
				.playNote(textureB + 72 + 12, "all")
				.stopNote(textureB + 72 + 12, "all", { time: 100 })
		}
	}

	onMixChanged = (mix) => {
		this.setState({ mix })
		isMIDIEnabled &&
			this.midiOut &&
			this.midiOut.sendControlChange(
				"modulationwheelfine",
				Math.floor((mix / STEPS) * 127),
				1,
			)
	}

	componentWillMount() {
		if (isMIDIEnabled) {
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
	}

	render() {
		const { edge, mix } = this.state

		return (
			<div className="App">
				<GraphData>
					{({ edges, vertices }) => (
						<Projector
							edges={edges}
							vertices={vertices}
							onEdgeChanged={this.onEdgeChanged}
							onMixChanged={this.onMixChanged}
						/>
					)}
				</GraphData>
				{isAudioEnabled && <AudioPlayer edge={edge} mix={mix} />}
			</div>
		)
	}
}

export default App

import React, { PureComponent, Fragment } from "react"
import { Howl, Howler } from "howler"

import loop1 from "../../assets/loop1.wav"
import loop2 from "../../assets/loop2.wav"
import loop3 from "../../assets/loop3.wav"
import loop4 from "../../assets/loop4.wav"
import loop5 from "../../assets/loop5.wav"
import loop6 from "../../assets/loop6.wav"
import loop7 from "../../assets/loop7.wav"
import loop8 from "../../assets/loop8.wav"
import loop9 from "../../assets/loop9.wav"
import loop10 from "../../assets/loop10.wav"
import loop11 from "../../assets/loop11.wav"

import { STEPS } from "../../App"

Howler.html5PoolSize = 24

const sounds = [
	loop1,
	loop2,
	loop3,
	loop4,
	loop5,
	loop6,
	loop7,
	loop8,
	loop9,
	loop10,
	loop11,
]

const soundsA = sounds.map(
	(loop) =>
		new Howl({
			src: loop,
			loop: true,
			preload: true,
			autoSuspend: false,
			volume: 0,
			stereo: -0.5,
		}),
)
const soundsB = sounds.map(
	(loop) =>
		new Howl({
			src: loop,
			loop: true,
			preload: true,
			autoSuspend: false,
			volume: 0,
			stereo: 0.5,
		}),
)

class AudioPlayer extends PureComponent {
	state = {
		loopsA: soundsA.map((h) => h.play()),
		loopsB: soundsB.map((h) => h.play()),
	}

	componentWillReceiveProps(newProps) {
		const { edge, mix } = newProps
		const { loopsA, loopsB } = this.state

		if (edge && edge.source && edge.target) {
			const srcSnd = edge.source % 11
			const endSnd = edge.target % 11

			const newMix = mix / STEPS / 2

			soundsA.forEach((sound, i) => {
				if (i !== srcSnd) {
					sound.volume(0, loopsA[i])
				} else {
					sound.volume(0.5 - newMix, loopsA[i])
				}
			})

			soundsB.forEach((sound, i) => {
				if (i !== endSnd) {
					sound.volume(0, loopsB[i])
				} else {
					sound.volume(0.5 + newMix, loopsB[i])
				}
			})
		}

		console.log("lol")
	}

	render() {
		return <Fragment>{}</Fragment>
	}
}

export default AudioPlayer

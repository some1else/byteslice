import React, { PureComponent } from "react"

const UPDATE_INTERVAL = 3000

class GraphData extends PureComponent {
	state = {
		edges: [],
		vertices: [],
		isLoaded: false,
	}

	async fetchGraph() {
		const resp = await fetch("http://localhost:3001/g2/projector")
		const graph = await resp.json()
		this.setState({ ...graph, isLoaded: true })
	}

	async componentDidMount() {
		await this.fetchGraph()
		this.updateInterval = setInterval(() => {
			this.fetchGraph()
		}, UPDATE_INTERVAL)
	}

	componentWillUnmount() {
		this.updateInterval && clearInterval(this.updateInterval)
	}

	render() {
		const { edges, vertices, isLoaded } = this.state
		const { children } = this.props
		if (isLoaded && edges.length > 1) {
			return children && children({ edges, vertices })
		} else {
			return <h4>Scraping... Please wait</h4>
		}
	}
}

export default GraphData

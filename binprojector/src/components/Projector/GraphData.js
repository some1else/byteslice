import { PureComponent } from "react"

const UPDATE_INTERVAL = 30000

class GraphData extends PureComponent {
	state = {
		edges: [],
		vertices: [],
		isLoaded: false
	}

	async fetchGraph() {
		const resp = await fetch("http://localhost:3001/update")
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
		if (isLoaded) {
			return children && children({ edges, vertices })
		} else {
			return null
		}
	}
}

export default GraphData

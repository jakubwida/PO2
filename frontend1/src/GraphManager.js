import * as d3 from "d3"

export default class GraphManager {

	constructor(width,height){
		this.dimensions = {
			x:width,
			y:height
			}
		this.parameters = {
			node_radius:20,
			link_size:100,
			charge_force:-200,
			center_force:10
			}

		this.indexed_nodes = {}
		this.nodes = [] //[{x:100,y:100,id:"0",links:[]},{x:150,y:100,id:"1"},{x:150,y:150,id:"2",links:[]},{x:150,y:120,id:"3",links:[]}]
		this.links = [] //[{source:this.nodes[0],target:this.nodes[1]}]

		this.svg = null;
		this.simulation = null;

		this.graph_json = {}
	}

	init = (graph_json) => {

		this._init_screen();
		this.simulation = d3.forceSimulation(this.nodes)
		  .force('charge', d3.forceManyBody().strength(this.parameters.charge_force))
			.force('x', d3.forceX(this.dimensions.x / 2))
			.force('y', d3.forceY(this.dimensions.y / 2))
			.force('links', d3.forceLink().links(this.links).id((d) => d.id).distance(this.parameters.link_size))
		  .on('tick', this._on_tick);

		//testing TEMP
		/*
		this.add_node({x:100,y:100},"A","root")
		this.add_node({x:100,y:120},"B","root")
		this.add_node({x:100,y:120},"C","root")
		this.add_node({x:100,y:120},"D","B")
		this.add_link("C","B")

		this.swap_nodes("A","B")
		*/
		//this.remove_node("2")
		//TEMP end

		//TEMP
		//this.graph_json = {"a":["b","d"],"b":[],"d":["b"]}
		this._apply_json({"a":["b","c"],"b":["c"],"c":[]})
		//TEMP end
	}

	add_node = (coords,node_id,precursor_id) => {
		var precursor = this.indexed_nodes[precursor_id]
		var node = {x:coords.x,y:coords.y,id:node_id,links:{},precursors:{}}
		this.nodes.push(node)
		this.indexed_nodes[node_id] = node
		this.add_link(precursor_id,node_id)
		this._restart()
	}

	add_pure_node = (coords,node_id) => {
		var node = {x:coords.x,y:coords.y,id:node_id,links:{},precursors:{}}
		this.nodes.push(node)
		this.indexed_nodes[node_id] = node
		this._restart()
	}

	remove_node = (node_id) => {
		var node = this.indexed_nodes[node_id]
		Object.keys(node.links).forEach((e)=>{this.remove_link(node_id,e)})
		Object.keys(node.precursors).forEach((e)=>{this.remove_link(e,node_id)})
		delete this.indexed_nodes[node_id]
		this.nodes = this.nodes.filter(el => el !== node);
		this._restart()
	}

	add_link = (node1_id,node2_id) => {
		//console.log(node1_id,node2_id)
		//console.log(this.indexed_nodes,this.nodes)
		var node_1 = this.indexed_nodes[node1_id]
		var node_2 = this.indexed_nodes[node2_id]
		var link = {source:node_1,target:node_2}

		node_1.links[node2_id] = link
		node_2.precursors[node1_id] = link

		this.links.push(link)
		this._restart()
		}

	remove_link = (node1_id,node2_id) => {
		var node_1 = this.indexed_nodes[node1_id]
		var node_2 = this.indexed_nodes[node2_id]
		var link = node_1.links[node2_id]

		delete node_1.links[node2_id]
		delete node_2.precursors[node1_id]
		this.links = this.links.filter(el => el !== link);
		this._restart()
		}

	swap_nodes = (node1_id,node2_id) => {
		//what needs to be done
		//1. swap all precursor links between two nodes.
		//2. swap all links to the node
		// generally, it will be easy to access the links in link list
		// difficult part will include swapping keys at linking nodes
		// we'll just do it wont we

		//swapping links in link list

		var node_1 = this.indexed_nodes[node1_id]
		var node_2 = this.indexed_nodes[node2_id]

		var node_1_prec = node_1.precursors
		var node_2_prec = node_2.precursors

		var list_of_node1_prec_nodes = []

		Object.keys(node_1_prec).forEach((e)=>{
			node_1_prec[e].target=node_2
			var precursor_node = node_1_prec[e].source
			list_of_node1_prec_nodes.push(precursor_node)

			delete precursor_node.links[node1_id]
			precursor_node.links["TEMPORARY_ID"] = node_1_prec[e]
			})
		Object.keys(node_2_prec).forEach((e)=>{
			node_2_prec[e].target=node_1
			var precursor_node = node_2_prec[e].source
			delete precursor_node.links[node2_id]
			precursor_node.links[node1_id] = node_2_prec[e]
		})

		list_of_node1_prec_nodes.forEach((e)=>{
			var link = e.links["TEMPORARY_ID"]
			delete e.links["TEMPORARY_ID"]
			e.links[node_2.id] = link
		})

		var temp_p = node_1_prec
		node_1.precursors = node_2_prec
		node_2.precursors = temp_p

		}


	//privates ====================================================================

	_init_screen = () => {
		this.svg = d3.select("body")
			.append("svg")
			.attr("width", this.dimensions.x)
			.attr("height", this.dimensions.y)

	//appending markers for lines
		this.svg.append('svg:defs').append('svg:marker')
	    .attr('id', 'end-arrow')
			.attr('class',"link_marker")
	    .attr('viewBox', '0 -5 10 10')
	    .attr('refX', 6)
	    .attr('markerWidth', 3)
	    .attr('markerHeight', 3)
	    .attr('orient', 'auto')
	  .append('svg:path')
	    .attr('d', 'M0,-5L10,0L0,5')
	    .attr('fill', '#000');
	}

	_on_tick = () => {
		this._update_nodes()
		this._update_links()
	}

	_update_nodes = () => {

		var u = this.svg.selectAll('.node')
    .data(this.nodes)

	  u.enter()
	    .append('circle')
	    .attr('r', this.parameters.node_radius)
			.merge(u)
	    .attr('cx', (d)=> {return d.x})
	    .attr('cy', (d)=> {return d.y})
			.attr("class", "node")

	  u.exit().remove()

		var t = this.svg.selectAll('.node_text')
		.data(this.nodes)

    t.enter()
			.append("svg:text")
			.merge(t)
			.attr('text-anchor', 'middle')
			.attr('x',(d)=> {return d.x})
			.attr('y',(d)=> {return d.y+4})
			.attr('class','node_text')
	  	.text((d)=> {return d.id})
	  t.exit().remove()
	}


	_update_links = () => {
		var u = this.svg.selectAll('.link')
    .data(this.links)


/*
	  u.enter()
	    .append('line')
			.merge(u)
	    .attr('x1', (d)=> {return d.source.x})
	    .attr('x2', (d)=> {return d.target.x})
	    .attr('y1', (d)=> {return d.source.y})
	    .attr('y2', (d)=> {return d.target.y})
			.attr("class", "link")
			.attr("marker-end","url(#end-arrow)")
*/
		u.enter()
			.append('path')
			.merge(u)
			.attr('d', (d) => {
		    const deltaX = d.target.x - d.source.x;
		    const deltaY = d.target.y - d.source.y;
		    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		    const normX = deltaX / dist;
		    const normY = deltaY / dist;
		    const padding = this.parameters.node_radius
		    const sourceX = d.source.x + (padding * normX);
		    const sourceY = d.source.y + (padding * normY);
		    const targetX = d.target.x - (padding * normX);
		    const targetY = d.target.y - (padding * normY);
	    return `M${sourceX},${sourceY}L${targetX},${targetY}`;
	  	})
			.attr("class", "link")
			.attr("marker-end","url(#end-arrow)")

	  u.exit().remove()
	}

	_restart = () => {
		this.simulation.nodes(this.nodes);
		this.simulation.force("links").links(this.links);
		this.simulation.alpha(1).restart();
	}


	_get_graph_to_json = () => {

		this.graph_json = {}
		Object.keys(this.indexed_nodes).forEach(e=>{
			var node = this.indexed_nodes[e]
			this.graph_json[e] = Object.keys(node.links)
		})

		//console.log(this.graph_json)
	}


	_apply_json = (graph_json) => {
		var add_links = []
		var remove_links = []
		var add_nodes = []
		var remove_nodes = []

		this._get_graph_to_json()
		//graph_json structure
		// {node_id: [linked_id1, linked_id2 ...], node_id2:[...] ...}

		var curr_keys = Object.keys(this.graph_json)
		var new_keys = Object.keys(graph_json)

		add_nodes = new_keys.filter( e => ! (e in this.graph_json) )
		remove_nodes = curr_keys.filter( e => ! (e in graph_json) )

		var remaining_nodes = curr_keys.filter( e => e in graph_json)

		add_nodes.forEach(source=>{
			graph_json[source].forEach(target => {
				add_links.push({source:source,target:target})
			})
		})

		remove_nodes.forEach(source=>{
			this.graph_json[source].forEach(target => {
				remove_links.push({source:source,target:target})
			})
		})

		remaining_nodes.forEach(source=>{
			let add_targets = graph_json[source].filter( e => ! (this.graph_json[source].includes(e)) )
			let remove_targets = this.graph_json[source].filter( e => ! (graph_json[source].includes(e)) )

			add_targets.forEach(e=>{
				add_links.push({source:source,target:e})
			})
			remove_targets.forEach(e=>{
				remove_links.push({source:source,target:e})
			})
		})

		/*
		console.log("add_nodes",add_nodes)
		console.log("remove_nodes",remove_nodes)
		console.log("add_links",add_links)
		console.log("remove_links",remove_links)
		*/

		// ================ implementing change =========
		var tempo = 0.2

		remove_links.forEach(e=>{
			this.remove_link(e.source,e.target)
		})

		remove_nodes.forEach(e=>{
			this.remove_node(e)
		})

		add_nodes.forEach(e=>{
			this.add_pure_node({x:0,y:0},e)
		})

		add_links.forEach(e=>{
			this.add_link(e.source,e.target)
		})

	}

}

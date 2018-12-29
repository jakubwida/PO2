console.log("Hello world")
import * as d3 from "d3"
import {foo} from "./imported"
import GraphManager from "./GraphManager"

var gm = new GraphManager(800,480)

gm.init()

//gm._restart()




//console.log(d3)
//console.log(foo)

/*
let body = d3.select("body")
var w_width = window.innerWidth;
var w_height = window.innerHeight;

var height = 480
var width = 800

let svg = body.append("svg").attr("width", width).attr("height", height)

var node_radius = 10;

//testing force layout

//var nodes = [{x:100,y:100},{x:100,y:200}]
//var links = [{source:0,target:1}]

var nodes = []

function ticked() {
  var u = d3.select('svg')
    .selectAll('circle')
    .data(nodes)

  u.enter()
    .append('circle')
    .attr('r', node_radius)
    .merge(u)
    .attr('cx', (d)=> {return d.x})
    .attr('cy', (d)=> {return d.y})

  u.exit().remove()
}

var simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-100))
	.force('x', d3.forceX(width / 2))
	.force('y', d3.forceY(height / 2))
  .on('tick', ticked);

//  .force('center', d3.forceCenter(height / 2, height / 2))


//onlclick

svg.on("click", function() {

	var coords = d3.mouse(this);

	//svg.append('circle').attr("cx",coords[0]).attr("cy",coords[1]).attr("r",node_radius)
 nodes.push({x:coords[0],y:coords[1]})
	restart()
})



function restart() {

  // Apply the general update pattern to the nodes.
  //node = node.data(nodes, function(d) { return d.id;});
  //node.exit().remove();
  //node = node.enter().append("circle").attr("r", node_radius).merge(node);

  // Update and restart the simulation.
  simulation.nodes(nodes);
  //simulation.force("link").links(links);
  simulation.alpha(1).restart();
}
*/

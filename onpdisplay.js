var width = 640,
    height = 300;
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
var color = d3.scaleOrdinal(d3.schemeCategory20);
var popup = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
d3.json("cncells.txt", function(error, graph) {
  if (error) throw error;
  var xPoint = d3.scalePoint()
	.domain(graph.locations.map(function(d) {return d.id}))
	.range([100, width - 100]);
  var locations = svg.append("g")
	.attr("class", "locations")
	.selectAll("circle")
	.data(graph.locations)
	.enter()
	.append('circle')
	.attr('cx', function(d) { return xPoint(d.id) })
	.attr('cy', function(d) {
    return d.id % 2 === 1 ? height/4 : height/2;
  })
	.attr('r', 60)
	.attr('fill', function(d) { return color(d.id) })
	.on("mouseover", loc("over"))
    .on("mouseout",loc("out"));;
  locations.append("title")
	.text(function(d) { return d.name; });
  svg.append("svg:defs").selectAll("marker")
    .data(["end"])
    .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20)
    .attr("refY", 0)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
	.attr("fill", "#999")
	.attr("fill-opacity", 0.6)
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");
	
  var link = svg.append("g")
	.attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
	.attr("stroke-width", 2)
	.attr("marker-end", "url(#end)");
  var nodes = svg.append("g")
    .attr("class", "nodes")
	.selectAll("circles")
	.data(graph.cells)
	.enter()
	.append('circle')
	.attr('r', 6)
	.attr('fill', function(d,i) { return color(d.location); })
  .on("mouseover", fade(.1,"over"))
  .on("mouseout",fade(.5,"out"));
  var position = d3.forceSimulation(nodes)
    .force('x', d3.forceX((d) => xPoint(d.location)).strength(0.8))
	  .force('y', d3.forceY(function(d) {
      return d.location % 2 === 1 ? height/4: height/2
     }).strength(0.4))
    .force("collide", d3.forceCollide(16));
  position.nodes(graph.cells)
    .on('tick', function() {
        nodes
            .attr('transform', (d) => {
                return 'translate(' + (d.x) + ',' + (d.y) + ')';
            });
    });
  var simulation = d3.forceSimulation(graph.links)
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody());
	simulation
      .nodes(graph.cells)
      .on("tick", ticked);
    simulation.force("link")
      .links(graph.links)
	  .strength(0);
	
 function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
	};
  
  
 var linkedByIndex = {};
    graph.links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });
     function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }
  
	function fade(opacity,event) {
        return function(d) {
          if (event === "over") {
              popup.transition()
                   .duration(100)
                   .style("opacity", .9);
              popup.html("cell: " + d.id)
                   .style("left", (d3.event.pageX + 20) + "px")
                   .style("top", (d3.event.pageY - 20) + "px");
              d3.select(this).classed("node-mouseover", true);
          } else
          if (event === "out") {
              popup.transition()
                   .duration(100)
                   .style("opacity", 0);
              d3.select(this).classed("node-mouseover", false);
          }
          nodes.style("stroke-opacity", function(o) {
            var thisOpacity = isConnected(d, o) ? 1 : opacity;
            this.setAttribute('fill-opacity', thisOpacity);
            return thisOpacity;
          });
          link.style("stroke-opacity", function(o) {
            return o.source === d || o.target === d ? 1 : opacity; });
          if (event === "out") {
              link.style("stroke-opacity", opacity);
              nodes.style("fill-opacity", 1);
	      nodes.style("stroke-opacity", 0.5);
          }
       }
	   }
	function loc(event) {
        return function(d) {
          if (event === "over") {
              popup.transition()
                   .duration(100)
                   .style("opacity", .9);
              popup.html("location: " + d.name)
                   .style("left", (d3.event.pageX + 20) + "px")
                   .style("top", (d3.event.pageY - 20) + "px");
              d3.select(this).classed("node-mouseover", true);
          } else
          if (event === "out") {
              popup.transition()
                   .duration(100)
                   .style("opacity", 0);
              d3.select(this).classed("node-mouseover", false);
        }
	}
	}
	});
//Define global margins for SVG canvases
var margin = {top: 20, right: 100, bottom: 30, left: 100},
width = 800 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);


// Define the lines
var valueLineTotalAssets = d3.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value.Assets); })
;
    
var valueLineTotalLiabilities = d3.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value.Liabilities); })
;
    
var parseTime = d3.timeParse("%Y")
    bisectDate = d3.bisector(function(d) { return d.key; }).left;


// Do everything with Data
d3.csv("https://geoffsegal.github.io/IL-Pension/data/PensionData20052016.csv", function(error, data) {
    if (error) throw error;

    // Format the data
    data.forEach(function(d) {
        d.Assets = +d.Assets;
        d.Liabilities = +d.Liabilities;
        d.Funding = +d.Assets / +d.Liabilities;
        d.Year = +d.Year;
        d.Fund_Name = d.Fund_Name;
    });

    //summarize the total assets/liabilities
    var totaldata = d3.nest()
        .key(function(d){return d.Year;})
        .rollup(function(v) { 
            return {
            Assets: d3.sum(v, function(d) { 
                return d.Assets; }),
            Liabilities: d3.sum(v, function(d) { 
                return d.Liabilities; })
                    };
        })
        .entries(data);

        console.log(totaldata);
    
    function makeLineChart(canvas, dataset, assetsline, liabilitiesline, yearvar, assetsvar, liabilitiesvar) {
        // Scale the range of the data
        x.domain(d3.extent(dataset, function(d) { return eval(yearvar); }));
        //y.domain([0,1])
        y.domain([0, d3.max(dataset, function(d) { return eval(liabilitiesvar);})*1.1]);

        // SVG canvas for graph
        var svg = d3.select(canvas)
        .append("svg")
        .style("width", width + margin.left + margin.right + "px")
        .style("height", height + margin.top + margin.bottom + "px")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "svgTotal");	


        //Add the x axis
        var xaxis = d3.axisBottom(x)
            .ticks(12)
            .tickSizeInner(10)
            .tickPadding(10)
            .tickFormat(d3.format("d"));
            
        svg.append("g")
           .attr("transform", "translate(0," + height + ")")
           .attr("class", "x axis")
           .call(xaxis);
           
        // Add the y Axis
      
        var yaxis = d3.axisLeft(y)
            .ticks(5)
            .tickSizeInner(0)
            .tickPadding(6)
            .tickSize(0,0);
            
            
        svg.append("g")
            .attr("class", "y axis")
            .call(yaxis);

        // Add a label to the y axis
        svg.append("text")
            .attr("fill","#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", 10)
            .attr("x",-350)
            .style("text-anchor", "end")
            .text("Funding ($)")
            .attr("class", "y axis label");
        
        // gridlines in x axis function
        function make_x_gridlines() {		
            return d3.axisBottom(x)
                .ticks(12)
        }

        // gridlines in y axis function
        function make_y_gridlines() {		
            return d3.axisLeft(y)
                .ticks(5)
        };

        // add the X gridlines
        svg.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
                );
            
        // add the Y gridlines
        svg.append("g")			
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
                );




        svg.append("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("class","line1")
        .attr("d", assetsline)

        ;
        
        
        svg.append("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("class","line2")
        .attr("d", liabilitiesline)
        ;

        svg.selectAll(".circle1")
        .data(dataset)
        .enter().append("circle")
        .attr("class","circle1")
        .attr("r", 6)
        .attr("cx", function(d,i) {  return x(eval(yearvar)); })
        .attr("cy", function(d,i) { return y(eval(assetsvar)); })
         
        ;
        svg.selectAll(".circle2")
        .data(dataset)
        .enter().append("circle")
        .attr("class","circle2")
        .attr("r", 6)
        .attr("cx", function(d,i) {  return x(eval(yearvar)); })
        .attr("cy", function(d,i) { return y(eval(liabilitiesvar)); });
        
        var focusa = svg.append("g")
        .attr("class", "focusa")
        .style("display", "none");
        var focusl = svg.append("g")
        .attr("class", "focusl")
        .style("display", "none");

        focusa.append("line")
            .attr("class", "x-hover-linea hover-linea")
            .attr("y1", 0)
            .attr("y2", height);

            focusl.append("line")
            .attr("class", "x-hover-linel hover-linel")
            .attr("y1", 0)
            .attr("y2", height);

        focusa.append("line")
            .attr("class", "y-hover-linea hover-linea")
            .attr("x1", width+100)
            .attr("x2", width);

            focusl.append("line")
            .attr("class", "y-hover-linel hover-linel")
            .attr("x1", width+100)
            .attr("x2", width);


        focusa.append("circle")
        .attr("class", "circlea")
        .attr("fill","#F1F3F3")
        .attr("stroke","rgba(85,170,0,1.0)")
        .attr("stroke-width", "5px")
        .attr("r", 7.5);

        focusl.append("circle")
        .attr("class", "circlel")
        .attr("fill","#F1F3F3")
        .attr("stroke","rgba(170,0,0,1.0)")
        .attr("stroke-width", "5px")
        .attr("r", 7.5);

        focusa.append("text")
        .attr("x", 0)
        .attr("dy", 30);

          focusl.append("text")
          .attr("x", 0)
          .attr("dy", 30);
          
        svg.append("rect")
          //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "overlay")
          .attr("width", width+20)
          .attr("height", height+10)
          .on("mouseover", function() { focusa.style("display", null);  focusl.style("display", null);})
          .on("mouseout", function() { focusa.style("display", "none");  focusl.style("display", "none"); })
          .on("mousemove", mousemove);
  
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(dataset, x0, 1),
                d0 = dataset[i - 1],
                d1 = dataset[i],
                d = x0 - d0.key > d1.key - x0 ? d1 : d0; //change variable input to account for this
            focusa.attr("transform", "translate(" + x(eval(yearvar)) + "," + y(eval(assetsvar)) + ")");
            focusa.select("text").text(function() { return "$"+d3.format(",.2f")(eval(assetsvar)/1000000000)+" Billion"; });
            focusa.select(".x-hover-linea").attr("y2", height - y(eval(assetsvar)));
            focusa.select(".y-hover-linea").attr("x2", width + y(eval(yearvar)));

            focusl.attr("transform", "translate(" + x(eval(yearvar)) + "," + y(eval(liabilitiesvar)) + ")");
            focusl.select("text").text(function() { return "$"+d3.format(",.2f")(eval(liabilitiesvar)/1000000000)+" Billion"; });
            focusl.select(".x-hover-linel").attr("y2", - y(eval(liabilitiesvar)));
            focusl.select(".y-hover-linel").attr("x2", width + y(eval(liabilitiesvar)));
        }
    }

    makeLineChart("#graphtotal", totaldata, valueLineTotalAssets, valueLineTotalLiabilities, "d.key", "d.value.Assets", "d.value.Liabilities")


var active = d3.select(null);

var projection = d3.geoAlbersUsa()
    .scale(4000)
    .translate([-300+width / 2, 100+height / 2]);

var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var path = d3.geoPath() // updated for d3 v4
    .projection(projection);

var svg = d3.select("#illinoismap").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var g = svg.append("g");

//svg.call(zoom); // delete this line to disable free zooming


d3.json("https://geoffsegal.github.io/IL-Pension/data/illinois-counties.json", function(error, topology) {
  if (error) throw error;

  g.selectAll("path")
      .data(topojson.feature(topology, topology.objects.cb_2015_illinois_county_20m).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
      .on("click", clicked);

  g.append("path")
      .datum(topojson.mesh(topology, topology.objects.cb_2015_illinois_county_20m, function(a, b) { return a !== b; }))
      .attr("class", "mesh")
      .attr("d", path);
});

function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);
  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

      svg.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
    console.log(d.properties.NAME);
    }

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svg.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
}

function zoomed() {
    g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    g.attr("transform", d3.event.transform); // updated for d3 v4
  }
  
  // If the drag behavior prevents the default click,
  // also stop propagation so we don’t click-to-zoom.
  function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
  }
  


})
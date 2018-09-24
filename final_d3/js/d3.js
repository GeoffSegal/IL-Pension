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
        d3.csv("../data/PensionData20052016_3.csv", function(error, data) {
    if (error) throw error;

    // Format the data
    data.forEach(function(d) {
        d.Assets = +d.Assets;
        d.Liabilities = +d.Liabilities;
        d.Funding = +d.Assets / +d.Liabilities;
        d.Year = +d.Year;
        d.Fund_Name = d.Fund_Name;
        d.County = d.County;
    });

    console.log(data);

    //summarize the total assets/liabilities
    var totaldata = d3.nest()
        .key(function(d){return d.Year;}).sortKeys(d3.ascending)
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
        // .style("display",null);
        var focusl = svg.append("g")
        .attr("class", "focusl")
        .style("display", "none");
        // .style("display", null);

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
            // .attr("x2",width + y(2016));

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
        //   .on("mouseout", function() { focusa.style("display", "none");  focusl.style("display", "none"); })
        .on("mouseout", function() { focusa.style("display", null);  focusl.style("display", null); })
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
        .scale(5000)
        .translate([-200+width / 2, 200+height / 2]);
    
    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);
    
    var maps = d3.map();
    var color = d3.scaleThreshold()
        .domain([0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00])
        .range(d3.schemeRdYlGn[10]);
 
    
    var path = d3.geoPath() // updated for d3 v4
        .projection(projection);
    
    var svg = d3.select("#illinoismap").append("svg")
        .attr("width", width+200)
        .attr("height", height+100)
        .on("click", stopped, true);
    
    // svg.append("rect")
    //     .attr("class", "background")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .on("click", reset);
    
    var g = svg.append("g");
    
    //svg.call(zoom); // delete this line to disable free zooming
    
    d3.queue()
        .defer(d3.json,"../data/illinois-counties.json")
        // .defer(d3.csv, "../data/countiesdata.csv", function(d) {maps.set(d.NAME, +d.Value);})
        .defer(d3.csv, "../data/countiesdata.csv")
        .await(ready);
    
    function ready(error,topology, countiesdata) {

    // d3.json("https://geoffsegal.github.io/IL-Pension/data/illinois-counties.json", function(error, topology) {
      if (error) throw error;
    

    


      var valueById = {};
      countiesdata.forEach(function(d) { valueById[d["NAME"]] = +d.Value; });
      console.log(valueById)

      var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-5, 0])
      .html(function(d) {
        var dataRow = valueById[d.properties.NAME];
           if (dataRow) {
               return d.properties.NAME + " County: " + d3.format(",.2%")(dataRow);
           } else {
               return d.properties.NAME + " County: No data.";
           }
      });
      g.call(tip);
      
      g.selectAll("path")
          .data(topojson.feature(topology, topology.objects.cb_2015_illinois_county_20m).features)
        .enter().append("path")
          .attr("d", path)
          .attr("class", "feature")
          //.style("fill", function(d) {return color(d.properties.ALAND/1000000000);} )
            .style("fill", function(d) {return color(valueById[d.properties.NAME]);})
            .on('mouseover', tip.show)
            
            .on('mouseout', tip.hide)
          .on("click", clicked);
    
      g.append("path")
          .datum(topojson.mesh(topology, topology.objects.cb_2015_illinois_county_20m, function(a, b) { return a !== b; }))
          .attr("class", "mesh")
          .attr("d", path);
    // });
    };
    
    // d3.select("#map")
    // .datum(data)
    // .call(Map.draw,map)



    // testdata = [["test","0.5"]];
    testdata= [[null,null]]
    columns = [0,1];

    // initializetable(testdata,[0,1]);


    // function initializetable(tabledata, columns) {

        var table = d3.select('#illinoistable').append('table');
        
        var thead = table.append('thead');
        var	tbody = table.append('tbody');

		// append the header row
		thead.append('tr')
		  .selectAll('th')
          .data(columns)
          .enter()
		  .append('th')
            .text(function(column,i){if (i == 0) {return null;} else {return null;}});

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(testdata)
		  .enter()
          .append('tr');
    

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return columns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
		  .append('td')
            .text(function (d) { return d.value; });
            
        d3.select('tbody').selectAll("*").remove();

	//   return table;
    // }

    
    function colorpicker(v){
        if (isNaN(v)) {return "#00000";}
        else {
        if(v<0.65) { return "#aa0000";}
        else if (v<0.8){ return "#f0bd27";}
        else if (v >=0.8) { return "#55aa00" ;}
        };

    };

    function formatter(v){
        if (isNaN(v)) {
            return v;}
        else {
            if (v == null) {
                return null;
            }
            else {
            return d3.format(",.2%")(v);
            }
        };

    };

    function updatetable(tabledata, columns) {

        d3.select('tbody').selectAll("*").remove();


    thead.selectAll('th')
    .data(columns)
    // .text(function(column,i){if (i == 0) {return "Individual Funds In This County:";} else {return "Funding Ratio:";}});
    .text(function(column, i) {return column});

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
    .data(tabledata)
    .enter()
    .append('tr');
  


    // create a cell in each row for each column
    var cells = rows.selectAll('td')
    // .data(function (row) {
    // return columns.map(function (column) {
    //     return {column: column, value: row[column]};
    // });
    // })
    .data(function(d,i) {
        return(d)
    })
    .enter()
    .append('td')
    .style('opacity', 0.0)
    .transition()
    .duration(750)
    .style('opacity', 1.0)
    .text(function (d) { return formatter(d);})
    .style("color",function(d,i) {return colorpicker(d)});



        
    }


    
    function clicked(d) {
      if (active.node() === this) return reset();

      d3.select("#illinoismap").selectAll("svg")
        .attr("width", width)
        .attr("height", height+100);

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

        var selectedfunds_name = [];
        var selectedfunds_ratio = [];
        //data.forEach(function(e) { if (e.County === d.properties.NAME & e.Year == 2016) {console.log(e.Fund_Name)}});
        data.forEach(function(e,i) { if (e.County === d.properties.NAME & e.Year == 2016) {selectedfunds_name[i] = e.Fund_Name; selectedfunds_ratio[i] = e.Funding}});
        selectedfunds_name = selectedfunds_name.filter(function(){return true;});
        selectedfunds_ratio = selectedfunds_ratio.filter(function(){return true;});

        var result = [];
        for ( var i = 0; i < selectedfunds_name.length; i++ ) {
            // result.push( [selectedfunds_name[i],  d3.format(",.2%")(selectedfunds_ratio[i])] );
                result.push([selectedfunds_name[i], selectedfunds_ratio[i]]);
          }

        
        

        result = result.sort(function(a,b) {
            return a[1]-b[1]
        });

        if (result.length == 0) {
            result = [["No data available for "+d.properties.NAME+" County", null]]
        }

        console.log(result)
 

        updatetable(result,["Funding Ratio for Each Fund in "+d.properties.NAME+" County"]);


        title=document.getElementById("maptitle");
        title.innerHTML = "Fund";

        document.getElementById("tempinstruction").innerHTML="";

        
        }
    
    function reset() {

        d3.select("#illinoismap").selectAll("svg")
        .attr("width", width+200)
        .attr("height", height+100);

      active.classed("active", false);
      active = d3.select(null);
    
      svg.transition()
          .duration(750)
          .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4

      d3.select('tbody').selectAll("*").remove();
      d3.selectAll('th').text(function(column,i){if (i == 0) {return null;} else {return null;}});

      title=document.getElementById("maptitle");
      title.innerHTML = "County";
    }
    
    function zoomed() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform); // updated for d3 v4
        
      }
      
      // If the drag behavior prevents the default click,
      // also stop propagation so we don’t click-to-zoom.
      function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
      };

     


})
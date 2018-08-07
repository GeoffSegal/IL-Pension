//Define global margins for SVG canvases
var margin = {top: 20, right: 20, bottom: 30, left: 100},
width = 700 - margin.left - margin.right,
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
d3.csv("https://geoffsegal.github.io/IL-Pension/data/PensionData20052017.csv", function(error, data) {
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
    
    function makeLineChart(canvas, data, assetsline, liabilitiesline, yearvar, assetsvar, liabilitiesvar) {
        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return eval(yearvar); }));
        //y.domain([0,1])
        y.domain([0, d3.max(data, function(d) { return eval(liabilitiesvar);})*1.1]);

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
            .ticks(4)
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
                .ticks(6)
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
        .datum(data)
        .attr("fill", "none")
        .attr("class","line1")
        .attr("d", assetsline)

        ;
        
        
        svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class","line2")
        .attr("d", liabilitiesline)
        ;

        svg.selectAll(".circle1")
        .data(data)
        .enter().append("circle")
        .attr("class","circle1")
        .attr("r", 6)
        .attr("cx", function(d,i) {  return x(eval(yearvar)); })
        .attr("cy", function(d,i) { return y(eval(assetsvar)); })
         
        ;
        svg.selectAll(".circle2")
        .data(data)
        .enter().append("circle")
        .attr("class","circle2")
        .attr("r", 6)
        .attr("cx", function(d,i) {  return x(eval(yearvar)); })
        .attr("cy", function(d,i) { return y(eval(liabilitiesvar)); });
        
        var focusa = svg.append("g")
        .attr("class", "focusa")
        .style("display", "none");
        var focusl = svg.append("g")
        .attr("class", "focusa")
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
            .attr("x1", width)
            .attr("x2", width);

            focusl.append("line")
            .attr("class", "y-hover-linel hover-linel")
            .attr("x1", width)
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
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.key > d1.key - x0 ? d1 : d0;
            focusa.attr("transform", "translate(" + x(d.key) + "," + y(d.value.Assets) + ")");
            focusa.select("text").text(function() { return "$"+d3.format(",.2f")(d.value.Assets/1000000000)+" Billion"; });
            focusa.select(".x-hover-linea").attr("y2", height - y(d.value.Assets));
            focusa.select(".y-hover-linea").attr("x2", width + y(d.key));

            focusl.attr("transform", "translate(" + x(d.key) + "," + y(d.value.Liabilities) + ")");
            focusl.select("text").text(function() { return "$"+d3.format(",.2f")(d.value.Liabilities/1000000000)+" Billion"; });
            focusl.select(".x-hover-linel").attr("y2", - y(d.value.Liabilities));
            focusl.select(".y-hover-linel").attr("x2", width + y(d.value.Liabilities));
        }
    }

    makeLineChart("#graphtotal", totaldata, valueLineTotalAssets, valueLineTotalLiabilities, "d.key", "d.value.Assets", "d.value.Liabilities")





})

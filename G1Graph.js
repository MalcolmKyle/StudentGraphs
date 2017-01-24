/*
Written by Malcolm Kyle McCullum
For the purpose of Green Mountain Technology interview project - 10-20-2016
Main library used for graphing is done through D3
Documentation: https://github.com/d3/d3/wiki

This file is used in the index.html from malcolmmccullum.com/GMT
to graph G1 status by final grade.

Would like to do Grouped Bar Chart:
https://bl.ocks.org/mbostock/3887051
However, issue with mean value of G1,G2,and G3 and nested keys 
*/
// Second graph - G1 status vs. final average
var G1Graph = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", 600)
  .style("display", "block")
  .style("margin","auto")
    .style("margin-bottom","15%")
.append("g")
  .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")");


d3.csv("comma-student-mat.csv", function(error, rawdata) {
if (error) throw error;
//console.log("rawdata", rawdata);

var data = rawdata.map(process);
// console.log("data", data);

var formatDecimal = d3.format("0.1f");


x.domain(data.map(function(d) { return d.G1; }));

y.domain([0,d3.max(data,function(d){return d.G3;})]);

  
  ///////////////////////////////////////////////////////6////////////////
  // for each unique value of G1 status, calculate average final grade

  var G1Averages = d3.nest()
        .key(function(d) { return d.G1 ;}).sortKeys(d3.ascending)
        .rollup(function(v) {
          return formatDecimal(d3.mean(v,function(g){return +g.G3;}));
        })
        .entries(data);
  G1Averages.sort(function(a,b) { return a.key - b.key });        

      console.log("G1Averages",G1Averages);
 ////////////////////////////////////////////////////////////////////
// Tip on top of bars
var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) { return "Final Grade: " + d.value; });

G1Graph.call(tool_tip);


///////////////////////////////////////////////////////////////////////
// append the the bar chart
// individual bars
G1Graph.selectAll(".bar")
    .data(G1Averages)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.key); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
    .on("mouseover",tool_tip.show)
    .on("mouseout",tool_tip.hide);

// add title to graph
G1Graph.append("text")
  .attr("x", (width / 2))             
  .attr("y", 10 - (margin.top / 2))
  .attr("text-anchor", "middle")  
  .style("font-size", "20px") 
  .style("text-decoration", "underline")
  .text("G1 Grade vs Final Average Grade");

// add the x Axis
G1Graph.append("g")
    .attr("transform", "translate(0," + height + ")")
    .style("font-size","18px")
    .call(d3.axisBottom(x));

    // label for the x axis
  G1Graph.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20 + 50) + ")")
      .style("text-anchor", "middle")
      .text("G1 Grade");

// add the y Axis
G1Graph.append("g")
    .style("font-size","18px")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Avg. Grade");


  // text label for the y axis
  G1Graph.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x",-150)
      .attr("dy", "1em")
      .style("text-anchor", "top")
      .text("Final Grade");  


});
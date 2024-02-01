var margin = {top: 80, right: 150, bottom: 0, left: 50},
width = 1100 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select('body').select("#tr")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

var zoom = d3.zoom()
.scaleExtent([0.9, 10]) //set the min and max zoom level
.translateExtent([[0, 0], [width, height]])
.on("zoom", function () {
const {x, y, k} = d3.event.transform;

svg.attr("transform", d3.event.transform);
});

// Apply zoom behavior to the svg
svg.call(zoom);
// add caption
var cap = svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "22px")

// Add X axis
var x = d3.scaleLinear()
.range([ 0, width ]);

// Add Y axis
var y = d3.scaleLinear()
 .range([ height+100, 0 ])

 // Add X axis label:
svg.append("text")
 .attr("text-anchor", "end")
 .attr("x", width-50)
 .attr("y", height-40 )
 .text("Time (year)");
function initData(dataFile){
  d3.csv(dataFile, function(data) {
    svg.append("g")
        .attr("transform", "translate(0," + height*0.8 + ")")
        .call(d3.axisBottom(x).tickSize(-height*.7).tickValues([1900, 1925, 1950,1975, 2000, 2025]))
        .select(".domain").remove()
        .select(".domain").remove()
    // update x and y axis
    x.domain(d3.extent(data, function(d) { return d.year; }))
  })
}
function updateData(dataFile) {
  svg.selectAll(".myArea").remove();
  svg.selectAll("g").remove();
  svg.selectAll(".adx").remove();

  svg.selectAll(".myArea")
  .transition()
  .duration(200)
  .style("opacity", 0)
  .remove();
  
  d3.csv(dataFile, function(data) {
    // set the dimensions and margins of the graph
      var keys = data.columns.slice(1)
      svg.append("g")
      .attr("class","xaxis")
        .attr("transform", "translate(0," + height*0.8 + ")")
        .call(d3.axisBottom(x).tickSize(-height*.8).tickValues([1900, 1925, 1950,1975, 2000, 2025]))
        .select(".domain").remove()
        .select(".domain").remove()
        var years = ["1,900", "1,925", "1,950","1,975", "2,000", "2,025"] // "1,900", "1,925", "1,950","1,975", "2,000", "2,025"
      //set caption
      if(dataFile=="year_cnt.csv"){
        svg.selectAll('.xaxis').data(years).enter().append("text")
        .style("text-anchor", "middle")
        .attr("class","adx")
        .attr("y", 225)
        .attr("x", function(d,i){return 235*i-254})
        .text(function(d) { return d;})
        .style("fill", "grey")
        svg.select("text").text("Timeriver of Number of Movies of Countries/Regions along the Time");
        y.domain([-200,110]) //-160000,100000 // -35,20
      }
      else{
        svg.selectAll('.xaxis').data(years).enter().append("text")
        .style("text-anchor", "middle")
        .attr("class","adx")
        .attr("y", 243)
        .attr("x", function(d,i){return 235*i-254})
        .text(function(d) { return d;})
        .style("fill", "grey")
        svg.select("text").text("Timeriver of Number of Movies of Genres along the Time");
        y.domain([-600,380]) //-160000,100000 // -35,20
      }

      // update x and y axis
      x.domain(d3.extent(data, function(d) { return d.year; }))
      

      // Customization
      svg.selectAll(".tick line").attr("stroke", "#b8b8b8")
    
      // color palette
      var color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeCategory20);
    
      //stack the data
      var stackedData = d3.stack()
        .offset(d3.stackOffsetSilhouette)
        .keys(keys)(data);
  
      // create a tooltip
    var Tooltip = svg.append("text")
    .style("opacity", 0)
    .style("font-size", 17);
    
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
    Tooltip.style("opacity", 1);
    d3.selectAll(".myArea").style("opacity", .1).style("z-index", 0);
    d3.select(this)
      .style("stroke", "grey")
      .style("opacity", 0.9)
      .raise();
    };
    var mousemove = function(d,i) {
    grp = keys[i];
    var mouseCoords = d3.mouse(this);
    Tooltip
      .attr("x", mouseCoords[0]-20 )
      .attr("y", mouseCoords[1] - 10)
      .text(grp)
      .style("fill","black")
      .raise();
    
    };
    var mouseleave = function(d) {
        Tooltip.style("opacity", 0);
        d3.selectAll(".myArea").style("opacity", 0.8).style("stroke", "none").lower();
      };
    
    
      // Area generator
      var area = d3.area()
        .x(function(d) { return x(d.data.year); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
        .curve(d3.curveCardinal);
     
        var areaGroup = svg.append("g");

        areaGroup.transition()
        .duration(1000)
        .style("opacity", 1)

        // add the areas to the group element
        areaGroup
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
          .attr("class", "myArea")
          .style("fill", function(d) { return color(d.key); })
          .style("opacity", 0)
          .attr("d", area)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
          .transition()
        .duration(300)
        .style("opacity", 0.9)
  });
}   

initData("year_gen_cnt.csv");
updateData("year_gen_cnt.csv");

d3.select("#btn1")
  .on("click", function() {
    updateData("year_cnt.csv");
  });

// Attach click event listener to the "Year Cnt" button
d3.select("#btn2")
  .on("click", function() {
    updateData("year_gen_cnt.csv");
  });
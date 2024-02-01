// set the dimensions and margins of the graph
var margin = {top: 60, right:  30, bottom: 10, left: 80},
  width = 1000 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bar")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
// add caption
svg.append("text")
.attr("x", (width / 2))
.attr("y", 0 - (margin.top / 2))
.attr("text-anchor", "middle")
.style("font-size", "22px")
.text("Parallel Plot of the Distribution of Film-Ratings by Years, Countries/Regions and Lengths");
// Parse the Data
d3.csv("ra_cnt.csv", function(data) {
//https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv
//'PG-13', 'R', 'PG', 'NC-17', 'TV-MA', 'TV-PG', 'TV-14'
  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain(['Teenagers', 'Adults', 'Children'])
    .range(d3.schemeCategory10); 

  // Here I set the list of dimension manually to control the order of axis:
  dimensions = ["year","Certificate","countries","Certificate2","time"]

  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
for (i in dimensions) {
  var name = dimensions[i]
  if (name == "time"){
    y[name] = d3.scaleLinear()
    .domain([30,275])
    .range([height, 0]);
  }
  else if(name == "metascore"){
    y[name] = d3.scaleLinear()
    .domain([0,110])
    .nice()
    .range([height, 0])
  }
  else if(name == "Certificate"){
    y[name] = d3.scalePoint()
    .domain(['Teenagers', 'Adults', 'Children'])
    .range([height,0]); 
  }
  else if(name == "genre"){
    y[name] = d3.scalePoint()
    .domain(['Action', 'Comedy', 'Drama', 'Horror', 'Crime', 'Animation',
    'Adventure', 'Biography', 'Thriller', 'Mystery', 'Fantasy',
    'Documentary', 'Western', 'Family', 'Romance', 'Film-Noir',
    'Sci-Fi'])
    .range([height,0]); 
  }
  else if(name == "Certificate2"){
    y[name] = d3.scalePoint()
    .domain(['Teenagers', 'Adults', 'Children'])
    .range([height,0]); 
  }
  else if(name == "countries"){
    y[name] = d3.scalePoint()
    .domain(['United States', 'United Kingdom', 'Germany', 'Canada', 'Japan',
    'Australia', 'New Zealand', 'India', 'Morocco', 'Norway',
    'South Korea', 'Ireland', 'Italy', 'France', 'Spain', 'Sweden',
    'Netherlands', 'Brazil', 'China', 'Mexico', 'Thailand',
    'Switzerland', 'Denmark', 'Finland', 'Philippines', 'Chile',
    'Sri Lanka', 'Indonesia', 'Iran', 'Pakistan', 'Belgium', 'Poland',
    'South Africa', 'Austria', 'Iceland', 'Czechia', 'Ukraine',
    'Singapore', 'Georgia', 'Russia', 'Slovakia', 'Hungary', 'Turkey'])
    .range([height,0]); 
  }
  else{
    y[name] = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d[name]; }))
    .nice()
    .range([height, 0])
  }
}
//tooltip to show the count of a category
var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("");

  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .domain(dimensions);

  // Highlight the specie that is hovered
  var highlight = function(d){

    selected_specie = d.Certificate

    //tooltip to show the count of a category
    var count = d3.selectAll("." + selected_specie).size();
    tooltip.text(selected_specie + ": " + count)
           .style("visibility", "visible")
           .style("font-family", "sans-serif")
           .style("fill", "#555");
    tooltip.style("top", (d3.event.pageY-10)+"px")
           .style("left",(d3.event.pageX+10)+"px");
    
    // first every group turns grey
    d3.selectAll(".line")
      .transition().duration(200)
      .style("stroke", "None")
      .style("opacity", "0.2")
    // Second the hovered specie takes its color
    d3.selectAll("." + selected_specie)
      .transition().duration(200)
      .style("stroke", color(selected_specie))
      .style("opacity", "1")
  }

  // Unhighlight
  var doNotHighlight = function(d){
    d3.selectAll(".line")
      .transition().duration(200).delay(1000)
      .style("stroke", function(d){ return( color(d.Certificate))} )
      .style("opacity", "1")
    tooltip.style("visibility", "hidden");
  }

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .enter()
    .append("path")
      .attr("class", function (d) { return "line " + d.Certificate } ) // 2 class for each line: 'line' and the group name
      .attr("d",  path)
      .style("fill", "none" )
      .style("stroke", function(d){ return( color(d.Certificate))} )
      .style("opacity", 0.5)
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight )

var titles = ["Year","Film-rating","Country/Region","Film-rating","Time"]

  // Draw the axis:
svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    .attr("class", "axis")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
    .style("stroke", "black")
    
    // Add axis title
    svg.selectAll("myAxis").data(titles).enter().append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .attr("x", function(d,i){return 220*i})
      .text(function(d) { return d;})
      .style("fill", "black")
    
      // create legend
      var legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (width -100) + "," + 0 + ")")
      .selectAll("g")
      .data(['Teenagers', 'Adults', 'Children'])
      .enter().append("g");

      legend.append("rect")
      .attr("y", function(d, i) { return i * 20; })
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", function(d) { return color(d); });

      legend.append("text")
      .attr("x", 15)
      .attr("y", function(d, i) { return i * 20 + 9; })
      .attr("dy", ".35em")
      .text(function(d) { return d; });
})

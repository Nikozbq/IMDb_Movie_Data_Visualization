
d3.csv("top_200_words.csv", function(d) {
    return {
      text: d.Word,
      size: +d.Count*3 // zoom the word into a proper size
    }
  },
  function(data) {
// create a search box to search word
    var searchInput = d3.select("body")
    .append("input")
    .attr("type", "text")
    .attr("placeholder", "Search")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("top", "20px")
    .style("left", "20px")
    .on("input", function() {
      var searchText = this.value.trim().toLowerCase();
      var searchRegex = new RegExp(searchText);
      d3.selectAll(".word")
        .style("opacity", function opacity(d) {
          if (d && searchRegex.test(d.text.toLowerCase())) {
            return 1;
          } else {
            return 0.1;
          }
        });
    });
  
// create word cloud
    d3.layout.cloud().size([1600, 1200]).words(
      data
      )
      .rotate(function() {
        return ~~(Math.random() * 2) * 90; // set a random direction of the word
      })
      .font("Impact")
      .fontSize(function(d) {
        return d.size;
      })
      .on("end", draw)
      .start();

    function draw(words) {
      console.log(words);
      var color = d3.scaleLinear()
      .domain([0, d3.max(words, function(d) { return d.size*3; })])
      .range(["#aad2ff", "#003366"]); // set the color range according to the frequency of the word

// create a dialog box to show word frequency
      var frequencyDiv = d3.select("body")
        .append("div")
        .attr("class", "frequency")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("padding", "5px")
        .style("border", "1px solid black");
 
      d3.select("svg")
        .select("g")
        .attr("mask", "url(#word-cloud-mask)")
        .attr("transform","scale(0.5)"); 
      
    
      d3.select("body").append("svg")
        .attr("width", 1600)
        .attr("height", 1200)
        .append("g")
        .attr("transform", "translate(800,600)")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .attr("class","word")
        .style("font-size", function(d) {
          return d.size + "px";
        })
        .style("font-family", "Impact")
        .style("fill", function(d) { return color(d.size*3); }) 
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) {
          return d.text;
        })
// Show interactions by moving the mouse to the word
        .on("mouseover", function(d) {


          frequencyDiv.style("visibility", "visible")
              .html("<p>Word: " + d.text + "</p><p>Count: " + d.size / 3 + "</p>")
              .style("top", (d3.event.pageY - 10) + "px")
              .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mousemove", function() {

          frequencyDiv.style("top", (d3.event.pageY - 10) + "px")
              .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", function() {

          frequencyDiv.style("visibility", "hidden");
      });
// create a download button to download a png file of the word cloud
        d3.select("body")
        .append("button")
          .text("Download")
          .on("click", function() {
            var svg = document.getElementsByTagName("svg")[0];
            var svgData = new XMLSerializer().serializeToString(svg);
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = svg.width.baseVal.value;
            canvas.height = svg.height.baseVal.value;
            var img = new Image();
            img.onload = function() {
              ctx.drawImage(img, 0, 0);
              canvas.toBlob(function(blob) {
                saveAs(blob, "wordcloud.png");
              });
            };
            var svgBase64 = btoa(encodeURIComponent(svgData).replace(/%([0-9A-F]{2})/g, function(match, p1) {
              return String.fromCharCode(parseInt(p1, 16))
            }));
            img.src = "data:image/svg+xml;base64," + svgBase64;
          });
    // create the title of the word cloud
    d3.select("svg")
    .append("text")
    .attr("x", 800)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text("Word Cloud of the Top 200 Occurred Words in Movie Titles")
    .style("font-size", "36px")
    .style("opacity", 1); // set opacity to 1
    }
  });

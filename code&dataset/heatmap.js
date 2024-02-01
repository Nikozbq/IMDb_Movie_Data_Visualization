// read the data from the CSV file
d3.csv("genres.csv", function(data) {
  // extract the genres and correlation matrix from the data
  var genres = data.columns.slice(1);
  var matrix = data.map(function(row) { return genres.map(function(genre) { return row[genre]; }); });

  console.log(genres)
  console.log(matrix)
  // show half of the correlation matrix
  var filtered_correlation_matrix = matrix.map((row, i) => row.map((value, j) => {
    if (i > j) {
      // Filter out the upper triangle
      return null;
    } else {
      // Keep the value
      return value;
    }
  }));
// Create heatmap
  var data=[
    {
        z:filtered_correlation_matrix, 
        x:genres,
        y:genres,
        colorscale: [
          [0, 'rgb(225, 240, 255)'],
          [0.2, 'rgb(180, 210, 255)'],
          [0.4, 'rgb(135, 180, 255)'],
          [0.6, 'rgb(90, 150, 255)'],
          [0.8, 'rgb(45, 120, 255)'],
          [1, 'rgb(0, 90, 255)']
        ],
        type:"heatmap",
        hoverongaps:false
    }
  ]
// Create the title
  var layout = {
    annotations: [{
      text: 'Heatmap of the Correlation between Genres',
      font: {
        family: 'Arial',
        size: 32,
        color: '#000000'
      },
      showarrow: false,
      xref: 'paper',
      yref: 'paper',
      x:0.1,
      y:1.1
    }]
  };
  TESTER = document.getElementById('tester');
  Plotly.newPlot(TESTER, data, layout);
})


var margin = {top: 20, right: 30, bottom: 30, left: 40}
var maxWidth = 850
var chartWidth = Math.min((window.innerWidth / 1.5), maxWidth) - margin.left - margin.right
var chartHeight = 500 - margin.top - margin.bottom

var y = d3.scaleLinear().range([chartHeight, 0])
var x = d3.scaleTime().rangeRound([0, chartWidth])

var line = d3.line()
    .x(function(d) {return x(d.date)})
    .y(function(d) {return y(d.temp)})

var lineChart = d3.select(".line-chart")
    .attr("width", chartWidth + margin.left + margin.right)
    .attr("height", chartHeight + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

d3.csv("https://www1.ncdc.noaa.gov/pub/orders/CDO7735027311925.txt", row, function(error, data){
  x.domain(d3.extent(data, function(d) {return d.date}))
  y.domain([d3.min(data, function(d) {return d.temp}), d3.max(data, function(d) {return d.temp})])

  var g = lineChart.append("g")

  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line)

  lineChart.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x))

  lineChart.append("g")
    .attr("transform", "translate(-10,0)")
    .call(d3.axisLeft(y))
  .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.7em")
    .attr("text-anchor", "end")
    .text("Temperature (deg. F)")
});

var parseDate = d3.timeParse("%Y%m%d")

function row(d) {
  return {
          date: parseDate(d[" YEARMODA"].trim()),
          temp: parseInt(d["   TEMP"])
          }
}

window.onresize = function() {
  var width = Math.min((window.innerWidth / 1.5), maxWidth) - margin.left - margin.right
  updateScales(width)
  updateAxes(width)
  updateBars()
}

function updateScales(width) {
  x.rangeRound([0, width])
}

function updateAxes(width) {
  d3.select('.x-axis')
    .call(d3.axisBottom(x).ticks(Math.max((width/75), 3)))
}

function updateBars() {
  lineChart.select('path')
    .attr("d", line);
}

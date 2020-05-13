import * as d3 from "d3"

const width = 500
const height = 500
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("border", "1px dashed")
const margin = {
  left: 30,
  right: 30,
  bottom: 30,
  top: 30,
}
function draw(type: "rect" | "line" = "rect") {
  const dataset = getData(100)
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset))
    .nice()
    .range([margin.left, width - margin.right])
  const histogram = d3
    .histogram()
    .domain(xScale.domain() as [number, number])
    .thresholds(xScale.ticks(20))
  const bins = histogram(dataset)
  console.log(
    bins,
    d3.max(bins, (d) => d.length)
  )
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, (d) => d.length)])
    .range([height - margin.bottom, margin.top])
  const xaxis = d3
    .axisBottom(xScale)
    .ticks(5)
  // .tickSizeOuter(0)
  const yaxis = d3.axisLeft(yScale)
  const gRect = svg.append("g")
  if (type === "rect") {
    gRect
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("width", (d) => {
        return Math.max(0, xScale(d.x1) - xScale(d.x0) - 1)
      })
      .attr("height", (d) => yScale(0) - yScale(d.length))
      .attr("x", (d, i) => {
        return xScale(d.x0) + 1
      })
      .attr("y", (d) => yScale(d.length))
      .attr("fill", d3.schemeCategory10[5])
  } else {
    const line = d3
      .line()
      .x((d: any) => xScale(d.x0))
      .y((d) => yScale(d.length))
      .curve(d3.curveBasis)
    gRect
      .append("path")
      .attr("d", line(bins as any))
      .attr("stroke", d3.schemeCategory10[3])
      .attr("fill", "none")
  }
  svg
    .append("g")
    .attr("transform", `translate(${0},${yScale(0)})`)
    .call(xaxis)
  svg.append("g").attr("transform", `translate(${margin.left})`).call(yaxis)
}
draw("rect")
function getData(n) {
  const rand = d3.randomNormal(170, 30)
  return d3.range(n).map(() => rand())
}

import * as d3 from "d3";
let svg: d3.Selection<SVGElement, unknown, HTMLElement, any>;
const width = 600;
const height = 500;
function domInit() {
  svg =
    svg ||
    d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px dashed");
}
domInit();

function drawLineChart() {
  const dataset = [
    {
      country: "china",
      gdp: getGdp(),
    },
    {
      country: "japan",
      gdp: getGdp(),
    },
  ];
  const padding = {
    top: 50,
    left: 50,
    right: 50,
    bottom: 50,
  };
  let gdpmax = 0;
  dataset.forEach(({ gdp }) => {
    gdpmax = Math.max(
      gdpmax,
      d3.max(gdp as any, (d: number[]) => {
        return d[1];
      })
    );
  });

  const xscale = d3
    .scaleLinear()
    .domain([2000, 2013])
    .range([0, width - padding.left - padding.right]);
  const yScale = d3
    .scaleLinear()
    .domain([0, gdpmax])
    .range([height - padding.top - padding.bottom, 0]);
  const linepath = d3
    .line()
    .x((d) => {
      return xscale(d[0]);
    })
    .y((d) => yScale(d[1]))
    .curve(d3.curveBasis);
  const colors = [d3.schemeCategory10[2], d3.schemeCategory10[8]];
  const g = svg
    .append("g")
    .style("border", "1px solid #000")
    .attr("transform", `translate(${padding.left},${padding.top})`);
  g.selectAll("path")
    .data(dataset)
    .enter()
    .append("path")
    .attr("d", (d) => linepath(d.gdp as any))
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", (_, i) => colors[i]);
  const xg = g
    .append("g")
    .attr("transform", `translate(0,${height - padding.top - padding.bottom})`);
  const yg = g.append("g");
  d3.axisBottom(xscale).tickFormat(d3.format("d"))(xg);
  d3.axisLeft(yScale)(yg);
  const legends = svg
    .selectAll(".legends")
    .data(dataset)
    .enter()
    .append("g")
    .classed("legends", true);
  legends
    .append("text")
    .text((d) => d.country)
    .attr("x", (_, i) => {
      return padding.left + i * 70;
    })
    .attr("y", padding.top - 16)
  legends
    .append("path")
    .attr("d", d3.symbol().size(100).type(d3.symbolCircle)())
    .attr("fill", (_, i) => colors[i])
    .attr("transform", (_, i) => {
      let x = padding.left + i * 70 - 10;
      let y = padding.top - 16 - 5;
      return `translate(${x},${y})`;
    });
}
drawLineChart();
function getGdp() {
  return d3
    .range(2000, 2014, 1)
    .map((year) => [year, Math.floor(10000 + Math.random() * 40000)]);
}

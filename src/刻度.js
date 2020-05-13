import * as d3 from "d3";
let svg;
function domInit() {
  svg =
    svg ||
    d3
      .select("body")
      .append("svg")
      .attr("width", 800)
      .attr("height", 500)
      .style("border", "1px dashed");
}
function testAxisLeft() {
  domInit();
  const scale = d3.scaleLinear().domain([0, 10]).range([0, 200]);
  const axisLeft = d3.axisLeft(scale).ticks(5, "s");
  const axisRight = d3
    .axisRight(scale)
    .tickValues([4, 5, 6, 7])
    .tickSizeInner(20)
    .tickSizeOuter(10)
    .tickFormat(d3.format("+0.1f"));
  const g = svg.append("g").attr("transform", "translate(40,20)");
  const g2 = svg.append("g").attr("transform", "translate(100,20)");
  axisLeft(g);
  axisRight(g2);
}

// testAxisLeft();

function testScale() {
  domInit();
  const linear = d3.scaleLinear().domain([0, 1]).range([0, 350]);
  const pow = d3.scalePow().exponent(2).domain([0, 1]).range([0, 350]);
  const log = d3.scaleLog().base(10).domain([10, 100]).range([0, 350]);
  const x1 = d3.axisBottom(linear);
  const x2 = d3.axisBottom(pow);
  const x3 = d3.axisBottom(log);
  const g1 = svg.append("g").attr("transform", "translate(40,80)");
  const g2 = svg.append("g").attr("transform", "translate(40,120)");
  const g3 = svg.append("g").attr("transform", "translate(40,160)");
  x1(g1);
  x2(g2);
  x3(g3);
}
// testScale()

function testGraph(n) {
  const lenData = d3.range(n);
  const dataset = lenData.map(() => (50 + Math.random() * 100) | 0);
  console.log(dataset);
  domInit();
  const graphHeight = 300;
  const graphWidth = 600;
  const graphG = svg
    .append("g")
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .attr("transform", "translate(40,40)")
    .style("border", "1px solid #000");
  //   step 50,width 40,padding 10
  const hPadding = 10;
  const vPadding = 10;
  const step = 50;
  const width = 40;
  let max = d3.max(dataset);

  // 坐标轴
  const xScale = d3.scaleBand().domain(lenData).range([0, graphWidth]).paddingInner(0.3);
  const yScale = d3.scaleLinear().domain([0, max]).range([graphHeight, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).ticks(10);
  const xg = svg
    .append("g")
    .attr("transform", `translate(40,${graphHeight + 40})`);
  const yg = svg.append("g").attr("transform", `translate(40,40)`);
  xAxis(xg);
  yAxis(yg);

  graphG
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (_, i) => {
      return xScale.paddingOuter() + i * xScale.step(); // 起点值
    })
    .attr("y", (d, i) => {
      //   height
      return yScale(d);
    })
    .attr("width", (_, i) => xScale.bandwidth())
    .attr("height", (d, i) => {
      console.log(yScale(d));
      return graphHeight - yScale(d);
    })
    .attr("fill", (_, i) => {
      const colors = d3.schemeCategory10;
      return colors[i % 10];
    });
  // add text
  graphG
    .selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("x", (_, i) => {
      return xScale.paddingOuter() + i * xScale.step(); // 起点值
    })
    .attr("y", (d, i) => {
      return yScale(d);
    })
    .attr("text-anchor", "middle")
    .attr("dx", (_, i) => xScale.bandwidth() / 2)
    .attr("dy", -5)
    .text((d) => d)
    .attr("fill", "#000");
}
testGraph(100);

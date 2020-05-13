import * as d3 from "d3";
let containerWidth = 500;
let containerHeight = 500;
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", containerWidth)
  .attr("height", containerHeight)
  .style("border", "1px dashed");
// 线段生成器
function testLines() {
  const lines: [number, number][] = [
    [80, 80],
    [200, 100],
    [200, 200],
    [100, 200],
  ];
  const linePath = d3.line();
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500)
    .style("border", "1px dashed");

  //   svg
  //     .append("path")
  //     .attr("d", linePath(lines))
  //     .attr("stroke", d3.rgb(243,56,22).toString())
  //     .attr("stroke-width",3)
  //     .attr("fill", "none");
  // console.log(linePath.x(1))
  const lines2 = [80, 120, 160, 200, 240, 280];
  const linep2 = d3
    .line<number>()
    .x((d) => d)
    .y((d, i) => {
      return i % 2 == 0 ? 40 : 120;
    })
    // .curve(d3.curveBundle.beta(0.75))
    // .curve(d3.curveCardinal)
    .curve(d3.curveStep);
  // .defined((d) => {
  //   return d < 200;
  // });
  svg
    .append("path")
    .attr("d", linep2(lines2))
    .attr("stroke", "#000")
    .attr("fill", "none");
}
// testLines();
// 区域生成器
function testArea() {
  const height = 300;
  const nums = 20;
  const dataset = d3
    .range(nums)
    .map(() => Math.floor(50 + Math.random() * 100));
  const areaPath = d3
    .area<number>()
    .x((d, i) => {
      return i * (containerWidth / (nums - 1));
    })
    .y0((d, i) => containerHeight)
    .y1((d, i) => containerHeight - d)
    .curve(d3.curveBasis);
    // .curve(d3.curveMonotoneY);
  svg
    .append("path")
    .attr("d", areaPath(dataset))
    .attr("stroke", d3.schemeCategory10[2])
    .attr("stroke-width", 2)
    .attr("fill", d3.schemeCategory10[3]);
}
// testArea();
// 弧生成器
function testAngle() {
  const dataset: Partial<d3.DefaultArcObject> = {
    startAngle: 0,
    endAngle: Math.PI * 0.25,
    innerRadius: 25,
    outerRadius: 100,
  };
  const arcPath = d3.arc();
  svg
    .append("path")
    .attr("d", arcPath(dataset as d3.DefaultArcObject))
    .attr("transform", "translate(100,200)")
    .attr("stroke", d3.schemeCategory10[1])
    .attr("stroke-width", 3)
    .attr("fill", d3.schemeCategory10[5]);
}
// testAngle()

function testBing() {
  const commonset = {
    innerRadius: 30,
    outerRadius: 100,
  };
  // 通常pad不需自己设置,通过pie generator生成
  const arcPath = d3.arc().cornerRadius(4).padAngle(Math.PI*0.01);
  const dataset = [
    {
      startAngle: 0,
      endAngle: Math.PI * 0.6,
      ...commonset,
    },
    {
      startAngle: Math.PI * 0.6,
      endAngle: Math.PI * 1,
      ...commonset,
    },
    {
      startAngle: Math.PI,
      endAngle: Math.PI * 1.7,
      ...commonset,
    },
    {
      startAngle: Math.PI * 1.7,
      endAngle: Math.PI * 2,
      ...commonset,
    },
  ];
  svg
    .selectAll("path")
    .data(dataset)
    .enter()
    .append("path")
    .attr("transform", "translate(120,120)")
    .attr("d", (d) => arcPath(d))
    .attr("stroke", "none")
    .attr("fill", (_, i) => d3.schemeCategory10[i % 10])
    .attr("stroke-width", 2);
  svg
    .selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("fill", (_, i) => {
      return d3
        .color(d3.schemeCategory10[i % 10])
        .brighter(3)
        .toString();
    })
    .attr("font-size", 18)
    .text(
      (d) => Math.floor(((d.endAngle - d.startAngle) * 180) / Math.PI) + "°"
    )
    .attr("transform", (d) => {
      console.log(arcPath.centroid(d));
      return `translate(120,120) translate(${arcPath.centroid(d)})`;
    });
}
testBing();

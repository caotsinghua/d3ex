import * as d3 from "d3";
function testColor() {
  const red = d3.rgb(255, 0, 0);
  const colorHsl = d3.hsl(120, 0.5, 0.5);
  console.log(red, colorHsl);
  console.log(red.hex()); // 16进制
  console.log(red.brighter(1));
}
// testColor()

function testInterpolation() {
  const a = d3.rgb(255, 0, 0);
  const b = d3.rgb(0, 255, 0);

  const compute = d3.interpolateRgb(a, b);
  const data = d3.range(-0.5, 1.5, 0.1).map((n) => compute(n));
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", 400)
    .attr("height", 400)
    .style("border", "1px dashed");
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (_, i) => {
      return 10 + 10 * i;
    })
    .attr("y", (_, i) => 50)
    .attr("width", 10)
    .attr("height", 50)
    .attr("fill", (d) => {
      return d.toString();
    });
}
testInterpolation();


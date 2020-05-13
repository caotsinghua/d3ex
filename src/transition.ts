import * as d3 from "d3";
function test1() {
  d3.select("body")
    .transition()
    .duration(1000)
    .ease(d3.easeBounce)
    .style("background-color", d3.schemeCategory10[2]);
}

// test1();
const width = 800;
const height = 500;
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
function testRect() {
  const rect = svg
    .append("rect")
    .attr("fill", d3.schemeCategory10[4])
    .attr("x", 50)
    .attr("y", 50)
    .attr("width", 100)
    .attr("height", 40)
    .transition()
    .ease(d3.easeBounce)
    .delay(500)
    .duration(500)
    .attr("width", 300)
    .transition()
    .duration(500)
    .attr("width", 200)
    .transition()
    .duration(500)
    .attr("fill", d3.schemeCategory10[8])
    .transition()
    .duration(500)
    .attr("height", 300)
    .transition()
    .duration(1000)
    .attr("width", 100)
    .attr("height", 40)
    .attr("fill", d3.schemeCategory10[4]);

  console.log(rect); // 返回的是一个过度对象而不是选择及对象
}
// testRect();

function testAttrTween() {
  const rect = svg
    .append("rect")
    .attr("fill", d3.schemeCategory10[1])
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 100)
    .attr("height", 30);
  const rectTran = rect
    .transition()
    .duration(2000)
    .attrTween("width", (d, i, a): any => {
      console.log(d, i, a);
      return d3.interpolate(100, 300);
    });
}
// testAttrTween();

function testText() {
  const rect = svg
    .append("rect")
    .attr("fill", d3.schemeCategory10[1])
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 100)
    .attr("height", 30);
  const initwidth = rect.attr("width");
  const rectTran = rect
    .transition()
    .duration(3000)
    .attrTween("width", function (d, i, a): any {
      return function (t) {
        return Number(initwidth) + t * 300;
      };
    });
  const text = svg
    .append("text")
    .attr("fill", "white")
    .attr("x", 100)
    .attr("y", 10)
    .attr("dy", "1.2em")
    .attr("text-anchor", "end")
    .attr("font-size", 16)
    .text(100);
  const initX = text.attr("x");
  const initTetx = text.text();
  const textTrans = text
    .transition()
    .duration(3000)
    .tween("text", function () {
      return function (t) {
        d3.select(this)
          .attr("x", Number(initX) + t * 300)
          .text(Math.floor(Number(initTetx) + t * 300));
      };
    })
    .transition()
    .duration(2000)
    .ease(d3.easeBounce)
    .attr("font-size", 0)
    .remove();
}
// testText();

function testChildren() {
  let g = svg.append("g");
  const dataset = d3.range(3).map(() => 100);

  const rect = g
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", (_, i) => d3.schemeCategory10[i % 10])
    .attr("id", (_, i) => "rect" + i)
    .attr("x", 10)
    .attr("y", (_, i) => 10 + i * 35)
    .attr("width", (d) => d)
    .attr("height", 30);
  //   g.select("#rect1").transition().delay(500).duration(1000).attr("width", 300);
  //   g.selectAll("rect")
  //     .transition()
  //     .delay((_, i) => i * 100)
  //     .duration(1000)
  //     .ease(d3.easeBounce)
  //     .filter((_, i) => i >= 1)
  //     .attr("width", Math.random() * 300 + 200);
  //   g.selectAll("rect")
  //     .transition()
  //     .duration(2000)
  //     .delay(1000)
  //     .on("start", (d, i) => {
  //       console.log("start", i);
  //     })
  //     .on("end", (d, i) => {
  //       console.log("end");
  //     })
  //     .attr("width", 300);

  //   let trans = g
  //     .transition()
  //     .duration(2000)
  //     .selectAll("rect")
  //     .on("interrupt", () => {
  //       console.log("打断");
  //     })
  //     .attr("width", 300);
  //   setTimeout(() => {
  //     // g.transition().selectAll("rect").attr("width", 10);
  //     g.selectAll("rect").interrupt();
  //   }, 1000);
  const xScale = d3.scaleLinear().domain([0, 10]).range([0, 300]);
  const xAixs = d3.axisBottom(xScale);
  g.attr("class", "axis").attr("transform", "translate(50,100)").call(xAixs);
  xScale.domain([0, 5]);
  g.transition().duration(2000).call(xAixs);
}

testChildren();

// function testEach(){

// }

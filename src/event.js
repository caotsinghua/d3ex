import * as d3 from "d3";

// const para= d3.select('body').append("p").text("click here")

const characters = ["A", "S", "D", "F"];
const width = 400;
const height = 400;

function d1() {
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  const rects = svg
    .selectAll("rect")
    .data(characters)
    .enter()
    .append("rect")
    .attr("x", (_, i) => 50 + 70 * i)
    .attr("y", 100)
    .attr("fill", d3.schemeCategory10[3])
    .attr("width", 60)
    .attr("height", 60)
    .attr("rx", 10);
  const texts = svg
    .selectAll("text")
    .data(characters)
    .enter()
    .append("text")
    .text((d) => d)
    .attr("text-anchor", "middle")
    .attr("x", (_, i) => 50 + 70 * i)
    .attr("dx", 30)
    .attr("dy", "0.5rem")
    .attr("y", 100 + 30)
    .attr("fill", "#fff")
    .attr("width", 60)
    .attr("height", 60)
    .attr("font-size", 26);

  d3.select("body").on("keydown", () => {
    rects.attr("fill", function (d) {
      if (d === String.fromCharCode(d3.event.keyCode)) {
        return d3.schemeCategory10[9];
      } else {
        return d3.schemeCategory10[3];
      }
    });
  });
}

// const div = d3
//   .select("body")
//   .append("div")
//   .style("padding", "50px")
//   .style("background", "gray");

// const svg = div
//   .append("svg")
//   .style("background", "yellow")
//   .attr("width", width)
//   .attr("height", height);

// svg
//   .append("rect")
//   .attr("x", 200)
//   .attr("y", 100)
//   .attr("width", 100)
//   .attr("height", 100)
//   .attr("fill", "green").on('click',function(){
//       console.log(d3.event)
//       console.log(d3.mouse(this))
//   });

function dragCircles() {
  const div = d3
    .select("body")
    .append("div")
    .style("padding", "10px")
    .style("background", "gray");

  const svg = div
    .append("svg")
    .style("background", "yellow")
    .attr("width", width)
    .attr("height", height);
  const circles = [
    {
      cx: 150,
      cy: 200,
      r: 30,
    },
    {
      cx: 250,
      cy: 200,
      r: 30,
    },
  ];
  const dragaction = d3
    .drag()
    .subject((d) => {
      // return {
      //   x: d.cx,
      //   y: d.cy,
      // };
      //   return { x: 100, y: 100 };
      return { x: d3.event.x, y: d3.event.y };
    })
    .on("start", function () {
      console.log("拖拽开始");
      d3.select(this)
        .transition()
        .attr("r", (d) => d.r * 1.3)
        .attr("stroke", d3.schemeCategory10[1])
        .attr("stroke-width", 3);
    })
    .on("end", function () {
      console.log("拖拽结束");
      d3.select(this)
        .transition()
        .attr("r", (d) => d.r)
        .attr("stroke", "none")
        .attr("stroke-width", 0);
    })
    .on("drag", function (d) {
      console.log(d3.event);
      d3.select(this)
        .attr("cx", (d.cx = d3.event.x))
        .attr("cy", (d.cy = d3.event.y));
    });
  svg
    .selectAll("circles")
    .data(circles)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.cx)
    .attr("cy", (d) => d.cy)
    .attr("r", (d) => d.r)
    .attr("fill", "black")
    .call(dragaction);
}

// dragCircles();

function useZoom() {
  const div = d3
    .select("body")
    .append("div")
    .style("padding", "10px")
    .style("background", "gray");

  const svg = div
    .append("svg")
    .style("background", "#ccc")
    .attr("width", width)
    .attr("height", height);
  const circles = [
    {
      cx: 150,
      cy: 200,
      r: 30,
    },
    {
      cx: 220,
      cy: 200,
      r: 30,
    },
    {
      cx: 150,
      cy: 270,
      r: 30,
    },
    {
      cx: 220,
      cy: 270,
      r: 30,
    },
  ];
  const xscale = d3.scaleLinear().domain([0, width]).range([0, width]);
  const yscale = d3.scaleLinear().domain([0, height]).range([0, height]);


  const g = svg.append("g");
  const xg = svg.append("g").attr("transform", `translate(0,${height - 40})`);
  let xAxis = d3.axisBottom(xscale);
  xg.call(xAxis)
  g.selectAll("circle")
    .data(circles)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.cx)
    .attr("cy", (d) => d.cy)
    .attr("r", (d) => d.r)
    .attr("fill", d3.schemeCategory10[3]);

  const zoom = d3
    .zoom()
    .scaleExtent([0, 5])
    .on("start", () => {
      console.log("zoom start");
    })
    .on("end", () => {
      console.log("zoom end");
    })
    .on("zoom", function () {
      console.log("x定义域", xscale.domain(), xscale.range());
      console.log("y domain", yscale.domain(), yscale.range());
      const { k, x, y } = d3.event.transform;
      console.log("zoom");
      d3.select(this).attr("transform", `translate(${x},${y}) scale(${k})`);
      xg.call(d3.axisBottom(d3.event.transform.rescaleX(xscale)))
    });

  g.call(zoom);
}
useZoom();



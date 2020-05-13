import * as d3 from "d3";
import { blob } from "d3";
const width = 500;
const height = 500;

function getSvg() {
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px dashed");
  return svg;
}

const pieSvg = getSvg();

async function buildPie() {
  const data = await getData();
  //   console.log(data)
  console.log(data);
  const pie = d3
    .pie()
    .value((d) => d["2018年"])
    .startAngle(Math.PI * 0.5)
    .endAngle(Math.PI * 2.5);
  const pieData = pie(data);
  console.log(pieData);
  //   init radius
  const outR = width / 3.5;
  const inR = 0;
  const arc = d3.arc().innerRadius(inR).outerRadius(outR);
  const arcs = pieSvg
    .selectAll("g")
    .data(pieData)
    .enter()
    .append("g")
    .attr("transform", `translate(${width / 2},${width / 2})`);
  // add arcs
  arcs
    .append("path")
    .attr("d", (d) => arc(d as any))
    .attr("fill", (_, i) => d3.schemeCategory10[i % 10])
    .on("mouseenter", function (e) {
      d3.select(this).transition().attr("fill", "#ccc");
    })
    .on("mouseleave", function (e) {
      d3.select(this)
        .transition()
        .attr("fill", () => {
          return d3.schemeCategory10[e.index % 10];
        });
    })
    .on("click", (e) => {
      alert(JSON.stringify(e));
    });
  // add inner text
  arcs
    .append("text")
    .text((d) => {
      return d.data["2018年"];
    })
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .attr("transform", (d, i) => {
      const position = arc.centroid(d as any);
      return `translate(${position[0]},${position[1]})`;
    })
    .attr("dy", "0.5rem");
  // add out
  arcs
    .append("line")
    .attr("stroke", "black")
    .attr("x1", (d) => arc.centroid(d as any)[0] * 2)
    .attr("y1", (d) => arc.centroid(d as any)[1] * 2)
    .attr("x2", (d) => arc.centroid(d as any)[0] * 2.2)
    .attr("y2", (d) => arc.centroid(d as any)[1] * 2.2);

  arcs
    .append("text")
    .attr("transform", (d) => {
      let x = arc.centroid(d as any)[0] * 2.5;
      let y = arc.centroid(d as any)[1] * 2.5;
      return `translate(${x},${y})`;
    })
    .attr("text-anchor", "middle")
    .text((d) => d.data["地区"]);
}
buildPie();

function getData() {
  return new Promise<any[]>((resolve, reject) => {
    d3.blob("./分省年度数据.csv").then((data) => {
      const reader = new FileReader();
      reader.readAsText(data, "gb2312");
      reader.onload = (e) => {
        const res = e.target.result;
        resolve(d3.csvParse(res as string));
      };
    });
  });
}

const forceSvg=getSvg()

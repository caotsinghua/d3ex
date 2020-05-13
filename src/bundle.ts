import * as d3 from "d3";

const width = 500;
const height = 500;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("border", "1px dashed");

function draw() {
  const cities = {
    name: "",
    children: [
      {
        name: "北京",
      },
      {
        name: "上海",
      },
      {
        name: "杭州",
      },
      {
        name: "广州",
      },
      {
        name: "桂林",
      },
      {
        name: "昆明",
      },
      {
        name: "成都",
      },
      {
        name: "西安",
      },
      {
        name: "太原",
      },
    ],
  };
  const railway = [
    {
      source: "北京",
      target: "上海",
    },
    {
      source: "北京",
      target: "广州",
    },
    {
      source: "北京",
      target: "杭州",
    },
    {
      source: "北京",
      target: "西安",
    },
    {
      source: "北京",
      target: "成都",
    },
    {
      source: "北京",
      target: "太原",
    },
    {
      source: "北京",
      target: "桂林",
    },
    {
      source: "北京",
      target: "昆明",
    },
    {
      source: "北京",
      target: "成都",
    },
    {
      source: "上海",
      target: "杭州",
    },
    {
      source: "昆明",
      target: "成都",
    },
    {
      source: "西安",
      target: "太原",
    },
  ];
  const data = d3.hierarchy(cities);
  const radius = width / 2 - 50;
  const cluster = d3
    .cluster()
    .size([360, radius])
    .separation((a, b) => {
      return (a.parent == b.parent ? 1 : 2) / a.depth;
    });
  cluster(data);
  const nodes = data.descendants();
  function map(nodes, links: any[]) {
    const hash = {};
    nodes.forEach((item) => {
      hash[item.data.name] = item;
    });
    const result = [];
    links.forEach((item) => {
      result.push([hash[item.source], hash[item.target]]);
    });
    return result;
  }
  const links = map(nodes, railway);
  console.log(links);
  const bundleLine = d3
    .lineRadial()
    .curve(d3.curveBundle)
    .radius((d: any) => d.y)
    .angle((d: any) => {
      return (d.x * Math.PI) / 180;
    });
  const gBundle = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);
  gBundle
    .selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("d", ([source, target]) => {
      return bundleLine(source.path(target));
    })
    .attr("stroke", "#444")
    .attr("fill", "none");
  console.log(nodes);
  const gnodes = gBundle
    .selectAll(".node")
    .data(nodes.filter((d) => !d.children))
    .enter()
    .append("g")
    .attr("transform", (d) => {
      return `rotate(${d.x - 90}) translate(${d.y}) rotate(${90-d.x})`;
    });
  gnodes.append("circle").attr("r", 4).attr("fill", "blue");
  gnodes.append("text").text(d=>d.data.name)
}

draw();

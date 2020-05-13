import * as d3 from "d3";
const width = 800;
const height = 800;
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("border", "1px dashed");

async function drawTree() {
  const data = await parseData();
  const hierachy = d3.hierarchy(data, (d) => d.children);
  const cluster = d3
    .cluster()
    .size([360, width / 2 - 130])
    .separation((a, b) => {
      return (a.parent == b.parent ? 1 : 2) / b.depth;
    });
  cluster(hierachy);

  //   const link = d3
  //     .linkHorizontal()
  //     .x((d: any) => d.y)
  //     .y((d: any) => d.x);
  // 放射性
  const link = d3
    .linkRadial()
    .angle((d: any) => (d.x / 180) * Math.PI)
    .radius((d: any) => d.y);
  const gTree = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${width / 2})`);
  const links = hierachy.links();
  const nodes = hierachy.descendants();
  console.log(nodes);
  const svgLinks = gTree
    .selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("d", (d) => link(d as any))
    .attr("fill", "none")
    .attr("stroke", "#444");
  const node = gTree
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .classed("node", true)
    .attr("transform", (d: any) => {
      return `rotate(${d.x - 90}) translate(${d.y},0)`;
    });
  node.append("circle").attr("r", 4.5).attr("fill", d3.schemeCategory10[6]);
  node
    .append("text")
    .attr("transform", (d:any) => {
      return d.x < 180 ? "" : "rotate(180)";
    })
    .attr("text-anchor", (d:any) => {
      return d.x < 180 ? "start" : "end";
    })
    .text((d) => {
      return d.data.name;
    })
    .attr("dx", (d:any) => (d.x < 180 ? 8 : -8))
    .attr("dy", 3);
}

drawTree();
async function parseData() {
  const r = () => import("./city.json");
  const source = await r();

  function getChildren(key) {
    const finded = source[key] || {};
    return Object.keys(finded)
      .map((key) => {
        const children = getChildren(key);
        return {
          key,
          name: finded[key],
          children: children.length > 0 ? children : null,
        };
      })
      .slice(0, 5);
  }
  const parsedSource = {
    name: "中国",
    key: 86,
    children: getChildren(86),
  };
  return parsedSource;
}

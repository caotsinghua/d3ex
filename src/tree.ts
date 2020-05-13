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
  const tree = d3
    .tree()
    .size([width*2, height - 200])
    .separation((a, b) => {
      return a.parent == b.parent ? 1 : 2;
    });
  tree(hierachy);

  const link = d3
    .linkHorizontal()
    .x((d: any) => d.y)
    .y((d: any) => d.x);
  const gTree = svg.append("g").attr("transform",'translate(50,0)');
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
    .attr("stroke", "#ccc");
  const node = gTree
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .classed("node", true)
    .attr("transform", (d:any) => {
      return `translate(${d.y},${d.x})`;
    });
  node.append("circle").attr("r", 4.5).attr("fill", d3.schemeCategory10[6]);
  node
    .append("text")
    .attr("text-anchor", (d) => {
      return d.children ? "end" : "start";
    })
    .text((d) => {
      return d.data.name;
    })
    .attr("dx", (d) => (d.children ? -8 : 8))
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

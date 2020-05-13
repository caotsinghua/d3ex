import * as d3 from "d3"

const width = 900
const height = 2400
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", `0 0 ${width} ${height}`)
  .style("border", "1px dashed")
async function parseData() {
  const r = () => import("./city.json")
  const source = await r()

  function getChildren(key) {
    const finded = source[key] || {}
    let start = Math.floor(Math.random() * 10)
    return Object.keys(finded)
      .map((key) => {
        const children = getChildren(key)
        return {
          key,
          name: finded[key],
          children: children.length > 0 ? children : null,
        }
      })
      .slice(start, Math.floor(2 + start + Math.random() * 10))
  }
  const parsedSource = {
    name: "中国",
    key: 86,
    children: getChildren(86),
  }
  return parsedSource
}

async function draw() {
  const cityData = await parseData()
  const hierachy = d3.hierarchy(cityData).count()

  console.log(hierachy)
  const partition = d3.partition().size([height, width])(hierachy)
  const nodes = hierachy.descendants()
  const links = hierachy.links()

  const color = d3.scaleOrdinal(
    d3.quantize(d3.interpolateRainbow, partition.children.length + 1)
  )
  console.log(color)

  const gRects = svg
    .selectAll(".gRect")
    .data(nodes)
    .join("g")
    .attr("transform", (d) => `translate(${d.y0},${d.x0})`)
  gRects
    .append("rect")
    .attr("width", (d) => d.y1 - d.y0)
    .attr("height", (d) => d.x1 - d.x0)
    .attr("stroke", "#fff")
    .attr("fill", (d) => {
      if (!d.depth) {
        return "#ccc"
      }
      let p = d
      while (p.depth > 1) p = p.parent
      return color(p.data.name)
    })
  gRects
    .filter((d) => d.x1 - d.x0 > 16)
    .append("text")
    // .attr("x", (d) => (d.x1 + d.x0) / 2)
    // .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("fill", "#fff")
    .attr("dx", (d) => (d.y1 - d.y0) / 2)
    .attr("dy", (d) => (d.x1 - d.x0) / 2)
    .text((d) => d.data.name)
    .attr("text-anchor", "middle")
    // .style("writing-mode", "tb")
    .style("font-size", 10)
}
draw()

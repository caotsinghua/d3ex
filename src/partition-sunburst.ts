import * as d3 from "d3"
import { format } from "d3"

const width = 900
const height = 900
const radius = (width - 50) / 2
const svg = d3.create("svg")

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

  const partition = d3.partition().size([2 * Math.PI, radius])(hierachy)
  const nodes = hierachy.descendants()
  const links = hierachy.links()
  console.log(hierachy)
  const color = d3.scaleOrdinal(
    d3.quantize(d3.interpolateRainbow, partition.children.length + 1)
  )

  const arc = d3
    .arc()
    .startAngle((d: any) => d.x0)
    .endAngle((d: any) => d.x1)
    .innerRadius((d: any) => d.y0)
    .outerRadius((d: any) => Math.max(0, d.y1 - 1))

  const gArc = svg
    .selectAll(".gArc")
    .data(nodes.filter((d) => d.depth))
    .join("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .attr("font-size", 10)

  gArc
    .append("path")
    .attr("d", arc as any)
    .attr("stroke", "#fff")
    .attr("fill-opacity", 0.6)
    .attr("fill", (d) => {
      let p = d
      while (p.depth > 1) p = p.parent
      return color(p.data.name)
    })
    .append("title")
    .text(
      (d) =>
        `${d
          .ancestors()
          .map((d) => d.data.name)
          .reverse()
          .join("/")}\n${d.value}`
    )

  gArc
    .append("text")
    .text((d) => d.data.name)
    .attr("transform", (d: any) => {
      const x = ((d.x1 + d.x0) * 180) / Math.PI / 2
      return `rotate(${x - 90}) translate(${(d.y1 + d.y0) / 2}) rotate(${
        x < 180 ? 0 : 180
      })`
    })
  return svg
    .attr("viewBox", function () {
      document.body.append(this)
      console.log(this.getBBox())
      const { x, y, width, height } = this.getBBox()
      return [x, y, width, height]
    } as any)
    .node()
}
draw()

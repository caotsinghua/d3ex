import * as d3 from "d3"

const width = 800
const height = 600

function getSales(n: number, startYear: number, keys: string[]) {
  return d3.range(n).map(() => {
    const t = {
      year: startYear++,
    }
    keys.forEach((key) => {
      t[key] = Math.round(1000 + Math.random() * 2000)
    })
    return t
  })
}

function draw(type: "rect" | "area" = "rect") {
  const keys = ["pc", "phone", "software"]
  const data = getSales(20, 2005, keys)

  const stack = d3
    .stack()
    .keys(keys)
    .value((d, key) => {
      return d[key]
    })
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone)
  const stackData = stack(data).map((d) => {
    d.forEach((v: any) => (v.key = d.key))
    return d
  })
  const color = d3
    .scaleOrdinal()
    .domain(keys)
    .range(d3.quantize(d3.interpolateRainbow, keys.length + 1))
    .unknown("#ccc")
  const margin = {
    left: 50,
    top: 30,
    right: 30,
    botttom: 30,
  }

  const xScale = d3
    .scaleBand()
    .domain(data.map((t) => t.year) as any)
    .range([margin.left, width - margin.right - margin.left])
    // .padding(0.05)
  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(stackData, (d: any) => d3.max(d, (d2: any) => d2[1]) as any),
    ])
    .range([height - margin.botttom - margin.top, margin.top])

  const svg = d3.create("svg")
  svg
    .append("g")
    .attr("transform", `translate(0,${yScale(0)})`)
    .call(d3.axisBottom(xScale).ticks(10))
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale))
  // axis end

  if (type === "rect") {
    svg
      .append("g")
      .selectAll("g")
      .data(stackData)
      .join("g")
      .attr("fill", (d) => color(d.key) as any)
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d: any, i) => {
        return xScale(d.data.year)
      })
      .attr("y", (d: any, i) => {
        return yScale(d[1])
      })
      .attr("width", xScale.bandwidth)
      .attr("height", (d: any) => yScale(d[0]) - yScale(d[1]))
      .append("title")
      .text((d: any) => {
        return `${d.data.year}\n销售额:${d.data[d.key]}`
      })
  } else {
    const area = d3
      .area()
      .x((d: any) => {
        return xScale(d.data.year) + xScale.bandwidth() / 2
      })
      .y0((d: any) => yScale(d[0]))
      .y1((d: any) => yScale(d[1]))
      .curve(d3.curveBasis)

    svg
      .append("g")
      .selectAll("g")
      .data(stackData)
      .join("g")
      .attr("fill", (d) => {
        return color(d.key) as string
      })
      .append("path")
      .attr("d", (d: any) => {
        return area(d)
      })
  }

  svg
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px dashed")
    .attr("viewBox", function () {
      document.body.append(this)
      //   const { x, y, width, height } = (this as SVGAElement).getBBox()
      return [0, 0, width, height]
    } as any)
}
draw("area")

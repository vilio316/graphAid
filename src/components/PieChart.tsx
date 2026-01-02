import * as d3 from 'd3'

import { useRef, useEffect } from "react"

export default function PieChart(){
    const svgRef = useRef(null)

useEffect(() => {
      const test_data = [
    { label: "A", value: 30 },
    { label: "B", value: 50 },
    { label: "C", value: 20 }, 
    {label: 'D', value: 30}
  ];

  const pie_colors = ['red', 'yellow', 'blue', 'green', 'orange', 'pink']

  const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "#111")
  .style("color", "#fff")
  .style("padding", "6px 10px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("pointer-events", "none")
  .style("opacity", 0);



  const width = 400;
  const height = 400;
  const radius = Math.min(width, height) / 2;

  const svg = d3.select(svgRef.current).attr('width', width).attr("height", height);
  svg.selectAll("*").remove();

  const g = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie<any>()
    .value(d => d.value);

  const arc = d3.arc<any>()
    .innerRadius(0)
    .outerRadius(radius);

  g.selectAll("path")
    .data(pie(test_data))
    .enter()
    .append("path")
    .attr("d", arc).on("mouseover", (event ,d) => {
        console.log(event.target)
    tooltip
      .style("opacity", 1)
      .html(`
        <strong>${d.data.label}</strong><br/>
        Value: ${d.data.value}
      `);
  })
  .on("mousemove", (event) => {
    tooltip
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY + 10}px`);
  })
  .on("mouseout", () => {
    tooltip.style("opacity", 0);
  }).attr("fill", (_, i) => pie_colors[i]);

}, []);


    return(
        <>
        <svg ref={svgRef} />
        </>
    )
}

/* 

*/
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function TestPlot() {
  const [data] = useState(
    [
    [90, 20],
    [20, 100],
    [66, 44],
    [53, 80],
    [24, 182],
    [33, 115], 
    [67, 67]
  ]
);

  const svgRef = useRef(null);

  useEffect(() => {
    const w = 400;
    const h = 320;
    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("overflow", "visible")
      .style("margin-top", "50px");

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, w]);
    const yScale = d3.scaleLinear().domain([0, 200]).range([h, 0]);

    const xAxis = d3.axisBottom(xScale).ticks(data.length);
    const yAxis = d3.axisLeft(yScale).ticks(10);
    svg.append("g").call(xAxis).attr("transform", `translate(0, ${h})`);
    svg.append("g").call(yAxis);

    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", h + 50)
      .text("x");

    svg
      .append("text")
      .attr("y", h / 2)
      .attr("x", -50)
      .text("y");

    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", 6);
  }, [data]);

  return (
    <>
      <div>Test Plot Here!</div>
      <svg ref={svgRef}></svg>
    </>
  );
}

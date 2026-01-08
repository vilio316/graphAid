import * as d3 from "d3";

import { useRef, useEffect, useState } from "react";

export default function PieChart() {
  const svgRef = useRef(null);
 
  const savings = [
    {
        label: 'String Beans', value: 234990
    } , 
    {
        label: "Mozarella", value: 456888
    }

  ]
  
  const arrCat = [
    { name: "Nasse" },
    {
      name: "Flash",
    },
    { name: "Flash" },
    { name: "Sheila" },
    {
      name: "Reginald",
    },
    {
      name: "Reginald",
    },
    {
      name: "Reginald",
    },
    {
      name: "Reginald",
    },
    {
      name: "Reginald",
    },
    {
      name: "Reginald",
    },
    {
      name: "Daniel",
    },
  ];


  useEffect(() => {
    const pie_colors = ["red", "yellow", "blue", "green", "orange", "pink"];

    const tooltip = d3
      .select("body")
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

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie<any>().value((d) => d.value);

    const arc = d3.arc<any>().innerRadius(0).outerRadius(radius);

    g.selectAll("path")
      .data(pie(savings))
      .enter()
      .append("path")
      .attr("d", arc)
      .on("mouseover", (event, d) => {
        //console.log(event.target);
        tooltip.style("opacity", 1).html(`
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
      })
      .attr("fill", (_, i) => pie_colors[i]);
  }, []);

  return (
    <>
      <svg ref={svgRef} />
    </>
  );
}

/* 

*/

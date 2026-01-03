//This sample uses the Plot library rather than d3 directly
//Components with the plot library
import * as Plot from '@observablehq/plot'
//import * as d3 from 'd3'

import { useRef, useEffect } from "react";

export default function PlottedWithPlot(
props : {
    chartType: string, 
    chartData: any[],  
    xCol: string,
    yCol: string
}
){
    const {chartData, chartType, xCol, yCol} = props
    const contRef = useRef<any>(null);
    const booleanTestVar  = true

    useEffect(() => {
        const plot = Plot.plot({
            y: {grid: true}, 
            x: {grid: true},
            marginTop: 60,
            marginBottom: 40,
            caption: "Fig. 1: Graph of x against y"
            ,
            marks: [
                booleanTestVar ? Plot.frame() : null,
                Plot.dot(chartData, {x: xCol, y: yCol, stroke: "blue"}),
                Plot.lineY(chartData, {x: xCol, y: yCol, stroke: 'red'}),
            ]
        })
        contRef?.current?.append(plot)
        return () => plot.remove();
    }, [chartData, chartType])

    return(
        <>
        <div ref={contRef} />
        </>
    )
}
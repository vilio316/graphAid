import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import * as Plot from '@observablehq/plot'
//import PlottedWithPlot from "./components/SecondPlot";
import PieChart from "./components/PieChart";

function App() {
  const [columns, updateColumns] = useState<any[]>([]);
  const [fileLoadState, changeFile] = useState(false);
  const [chartCols, updateChartCols] = useState({
    xCol: "",
    yCol: "",
  });
  const [fileState, addFileDetails] = useState<any[]>();
  const [selectedChartType, updateChartType] = useState("");

  const changeHandler = async (e: any) => {
    const file = await e.target.files[0].text();
    const parsed_values = await d3.csvParse(file);
    addFileDetails(parsed_values);
    console.log(parsed_values)
    updateColumns(parsed_values.columns);
    changeFile(true);
  };


  function PlottedWithPlot(
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
              width: 1080,
              height: 850,
              color: {
                legend: true, 
                scheme: "BuRd"
              }, 
              marginTop: 20,
              marginBottom: 40,
              caption: `Fig. 1: Graph of ${xCol} against ${yCol}`
              ,
              marks: [
                  booleanTestVar ? Plot.frame() : null,
                  Plot.barY(chartData, {x: xCol, y: yCol, stroke: xCol}),
                  /*Plot.lineX(chartData, {x: xCol, y: yCol
                  }),*/
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

  return (
    <>
      <div className="homepage p-4 mx-auto">
        <p className="text-xl font-bold">GraphAid</p>
        <p>
          Generating beautiful graphs is <i>probably</i> easier than this lol
        </p>

        <div className="w-full flex items-start">
          <div>
            <p>Data Entry</p>
            <p>Please upload your CSV file here</p>
            <label
              htmlFor="file"
              className="text-white text-center grid items-center bg-blue-400 p-2 font-bold w-1/2 rounded-xl my-4"
            >
              <span>Upload File Here</span>
              <input
                type="file"
                name="file"
                id="file"
                multiple={false}
                style={{
                  visibility: "hidden",
                  height: 0,
                }}
                accept=".csv"
                onChange={changeHandler}
              />
            </label>
            <div className={`${fileLoadState ? "block" : "hidden"} `}>
              <p>{columns.length} columns present in your uploaded file</p>
              <div className="flex">
                <label>Chart Type: </label>
                <select
                  className="border-2 border-blue-500 m-2 p-1 rounded-xl"
                  onChange={(e) => {
                    updateChartType(e.target.value);
                  }}
                >
                  <option value={"lineX"}>Line Chart</option>
                  <option value={"barX"}>Horizontal Bar Chart</option>
                  <option value={"barY"}>Vertical Bar Chart</option>
                  <option value={"pie"}>Pie Chart</option>
                  <option value={"dot"}>Scatter Plot</option>
                </select>
              </div>
              <p>
                Y-axis:
                <select
                  className="border-2 border-blue-500 m-2 p-1 rounded-xl"
                  onChange={(e) =>{
                    updateChartCols({ ...chartCols, yCol: e.target.value }); 
                  }}
                >
                  {columns.map((column) => (
                    <option value={column} key={column} className="capitalize">
                      {column}
                    </option>
                  ))}
                </select>
              </p>

              <p>
                X-axis:
                <select
                  className="border-2 border-blue-500 m-2 p-1 rounded-xl"
                  onChange={(e) =>{
                    updateChartCols({
                      ...chartCols,
                      xCol: e.target.value,
                    });
                  }}
                >
                  {columns.map((column) => (
                    <option value={column} key={column} className="capitalize">
                      {column}
                    </option>
                  ))}
                </select>
              </p>

              <button className="text-white font-bold text-xl w-1/2 text-center ">
                Generate Graph
              </button>
            </div>
          </div>
          <div className="justify-center grid">
            {fileState? 
            <PlottedWithPlot chartData={fileState.length > 10000 ? fileState.slice(0, 100) : fileState} chartType={selectedChartType} xCol={chartCols.xCol} yCol={chartCols.yCol} /> : null
            }
            </div>
        </div>
      </div>
    </>
  );
}

export default App;

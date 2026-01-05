import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
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
    //console.log(parsed_values)
    addFileDetails(parsed_values);
    updateChartCols({ xCol: "", yCol: "" });
    updateColumns(parsed_values.columns);
    changeFile(true);
  };


  function PlottedWithPlot(props: {
    chartType: string;
    chartData: any[];
    xCol: string;
    yCol: string;
  }) {
    //lineX, lineY, barX, barY, pie, dot,
    const { chartData, chartType, xCol, yCol } = props;
    const contRef = useRef<any>(null);

    const plot = (chartType: string) => {
      const width = 900;
      const height = 550;
      return Plot.plot({
        y: {
          grid: true,
          transform:
            chartType == "lineX" || chartType == "barY" || chartType == "dot"
              ? (y) => Number(y)
              : (y) => y,
        },
        x: {
          grid: true,
          transform:
            chartType == "barX" || chartType == "dot"
              ? (x) => Number(x)
              : chartType == "barY"
                ? (x) => x.slice(0, 4)
                : (x) => x,
        },
        width: width,
        height: height,
        marginLeft: 140,
        caption: `Figure 1: Graph of ${xCol} against ${yCol}`,
        marks: [
          Plot.frame(),
          chartType == "lineX"
            ? Plot.lineX(chartData, {
                x: xCol,
                y: yCol,
                stroke: "blue",
              })
            : null,
          chartType == "barX"
            ? Plot.barX(chartData, {
                x: xCol,
                y: yCol,
                className: "fill-blue-400",
              })
            : null,
          chartType == "dot"
            ? Plot.dot(chartData, {
                x: xCol,
                y: yCol,
                className: "fill-blue-400",
              })
            : null,
          chartType == "barY"
            ? Plot.barY(chartData, {
                x: xCol,
                y: yCol,
                className: "fill-blue-400",
              })
            : null,
        ],
      });
    };

    useEffect(() => {
      const plottedGraph = plot(chartType);
      contRef?.current?.append(plottedGraph);
      return () => plottedGraph.remove();
    }, [chartData, chartType]);

    return (
      <>
        {chartType !== 'pie' ? <div ref={contRef} /> : 
        <div className="grid justify-center">
        <PieChart />
        </div>
  }
      </>
    );
  }

  return (
    <>
      <div className="homepage p-4 mx-auto">
        <div className="header my-4 ">
          <p className="text-xl font-bold">GraphAid</p>
          <p>
            Generating beautiful graphs is <i>probably</i> easier than this lol
          </p>
        </div>

        <div className="w-full grid grid-cols-4 gap-x-4 items-start p-4 border-2 border-gray-500 rounded-4xl">
          <div className={`${fileState ? `col-span-1`: `col-span-2`} p-4`}>
            <p className="font-bold text-2xl">Data Entry</p>
            <p>Please upload your CSV file here</p>
            <label
              htmlFor="file"
              className="text-white text-center justify-center grid items-center bg-blue-400 p-2 font-bold rounded-xl my-4"
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
              <div className="flex items-center">
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
                  onChange={(e) => {
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
                  onChange={(e) => {
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
          <div className="grid col-span-3">
            {fileState &&
            selectedChartType.length > 0 &&
            chartCols.yCol.length > 0 ? (
              <PlottedWithPlot
                chartData={
                  fileState.length > 10000
                    ? fileState.slice(5000, fileState.length - 1)
                    : fileState
                }
                chartType={selectedChartType}
                xCol={chartCols.xCol}
                yCol={chartCols.yCol}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

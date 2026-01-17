import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
//import PlottedWithPlot from "./components/SecondPlot";
import PieChart from "./components/PieChart";
import { FaChartBar, FaChartLine, FaChartPie } from "react-icons/fa6";
import { FaRegChartBar } from "react-icons/fa";
import { LuChartScatter } from "react-icons/lu";

function App() {
  const [columns, updateColumns] = useState<any[]>([]);
  const [fileName, changeFileName] = useState("");
  const [fileLoadState, changeFile] = useState(false);
  const [chartCols, updateChartCols] = useState({
    xCol: "",
    yCol: "",
  });
  const [color, reColor] = useState('blue')
  const [fileState, addFileDetails] = useState<any[]>();
  const [selectedChartType, updateChartType] = useState("lineX");
  const [hasArea, addArea] = useState(false);

  const changeHandler = async (e: any) => {
    const file = await e.target.files[0].text();
    changeFileName(e.target.files[0].name);
    const parsed_values = await d3.csvParse(file);
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
    color?: string
  }) {
    //lineX, lineY, barX, barY, pie, dot, lineXShaded
    const { chartData, chartType, xCol, yCol, color } = props;
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
        caption: `Figure 1: Graph of ${yCol} against ${xCol}`,
        marks: [
          //Plot.frame(),
          chartType == "lineX"
            ? Plot.lineX(chartData, {
                x: xCol,
                y: yCol,
                stroke: `${hasArea ? "black" : 'blue'}`,
              })
            : null,
          chartType == "barX"
            ? Plot.barX(chartData, {
                x: xCol,
                y: yCol,
                fill: color,
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
                fill: color,
              })
            : null,
          hasArea
            ? Plot.areaY(chartData, {
                x: xCol,
                y: yCol,
                className: `opacity-70`,
                fill: color
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
        {chartType !== "pie" ? (
          <div ref={contRef} />
        ) : (
          <div className="grid justify-center">
            {fileState ? (
              <PieChart data={fileState} col={yCol} />
            ) : (
              <p>Can't find fileState</p>
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="homepage p-4 mx-auto">
        <div className="header my-2">
          <p className="text-3xl font-bold">GraphAid</p>
          <p className="text-lg my-2">
            Generating beautiful graphs is <i>probably</i> easier than this lol
          </p>
        </div>

        <div className="w-full grid md:grid-cols-5 gap-x-4 items-start p-4 border-2 border-gray-500 rounded-4xl">
          <div className={`md:col-span-2 p-4`}>
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
              <p className="my-2">
                {columns.length} columns present in your uploaded file (
                {fileName}){" "}
              </p>
              <div className="w-full">
                <div className="flex gap-x-4 w-4/5 items-center">
                <p className="underline font-bold ">Chart Type </p>  
                <button
                  onClick={() => addArea(!hasArea)}
                  className={`${selectedChartType == "lineX" ? "" : "hidden"} justify-self-end bg-blue-400 p-1 text-white rounded-xl `}
                >
                {hasArea ? "Hide Area" : 'Show Area'}
                </button>
                </div>
                <div className="flex p-1 gap-x-1 my-1">
                  <div className={`flex gap-x-2 items-center rounded-3xl p-2 ${selectedChartType == "lineX"? 'bg-blue-400 text-white':`bg-gray-200 text-gray-600`}`} onClick={() => updateChartType('lineX')}>
                    <FaChartLine className="inline text-2xl" />
                    <span>Line Chart</span>
                  </div>

                   <div className={`flex gap-x-2 items-center rounded-3xl p-2 ${selectedChartType == "barX"? 'bg-blue-400 text-white':`bg-gray-200 text-gray-600`}`} onClick={() => updateChartType('barX')}>
                    <FaChartBar className="inline text-2xl" />
                    <span>Bar Chart (Horizontal) </span>
                  </div>

                   <div className={`flex gap-x-2 items-center rounded-3xl p-2 ${selectedChartType == "barY"? 'bg-blue-400 text-white':`bg-gray-200 text-gray-600`} `} onClick={() => updateChartType('barY')}>
                    <FaRegChartBar className="inline text-2xl" />
                    <span>Bar Chart (Vertical)</span>
                  </div>

                  

                  </div>
                  <div className="flex p-1 gap-x-1 my-1">
                   <div className={`flex gap-x-2 items-center ${selectedChartType == "pie"? 'bg-blue-400 text-white':`bg-gray-200 text-gray-600`} rounded-3xl p-2 transition-colors`} onClick={() => updateChartType('pie')}>
                    <FaChartPie className="inline text-2xl" />
                    <span>Pie Chart</span>
                  </div>

                   <div className={`flex gap-x-2 items-center ${selectedChartType == 'dot'? 'bg-blue-400 text-white' :'bg-gray-200 text-gray-600' }  rounded-3xl p-2 transition-colors`} onClick={() => updateChartType('dot')}>
                    <LuChartScatter className="inline text-2xl" />
                    <span>Scatter Plot</span>
                  </div>
                </div>

                
              </div>
              <p>
                {selectedChartType == "pie" ? "Pie Chart Column:" : "Y-axis:"}
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

              <p
                className={`${selectedChartType == "pie" ? "hidden" : "block"}`}
              >
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

              <div className={`flex gap-x-4 ${selectedChartType == 'pie' ? 'hidden' : 'block'} my-2`}>
              <label htmlFor="color"> {hasArea ? "Area" : ''} Color: </label>
              <input type="color" name="color" id="color" onChange={(e) => {
                reColor(e.target.value)
              }} />
      
              <button className="text-white font-bold text-xl w-1/2 text-center ">
                Generate Graph
              </button>
            </div>
            </div>
          </div>
          <div
            className={`grid md:col-span-3 justify-${selectedChartType == "pie" ? "center" : "end"}`}
          >
            <>
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
                  color={color}
                />
              ) : null}
            </>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

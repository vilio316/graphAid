import { useState } from "react";
import * as d3 from "d3"
import PlottedWithPlot from "./components/SecondPlot";

function App() {
  const [columns, updateColumns] = useState<any[]>([])
  const [fileLoadState, changeFile] = useState(false)

  const changeHandler = async(e: any) => {
    const file = await e.target.files[0].text()
    const parsed_values = await d3.csvParse(file)
    updateColumns(parsed_values.columns)
    changeFile(true)
  }

  return (
    <>
      <div className="homepage p-4 mx-auto">
        <p className="text-xl font-bold">GraphAid</p>
        <p>
          Generating beautiful graphs is <i>probably</i> easier than this lol
        </p>

        <div className="w-full grid grid-cols-2 items-center">
          <div>
            <p>Data Entry</p>
            <p>Please upload your CSV file here</p>
            <label htmlFor="file" className="text-white text-center grid items-center bg-blue-400 p-2 font-bold w-1/2 rounded-xl my-4"  >
              <span>Upload File Here</span>
               <input type="file" name="file" id="file" multiple={false} style={{
              visibility: 'hidden', 
              height: 0
            }} accept=".csv" onChange={changeHandler}/>
            </label>
            <div className={`${fileLoadState ? 'block': 'hidden'} `}>
              <p>{columns.length} columns present in your uploaded file</p>
              <div className="flex">
                <p>Chart Type: </p>
              </div>
              <p>
                X-axis: 
              <select className="border-2 border-blue-500 m-2 p-1 rounded-xl" >
                {columns.map((column) => <option value={column} key={column} className="capitalize">
                  {column}
                </option> )}
              </select>
              </p>

               <p>
                Y-axis: 
              <select className="border-2 border-blue-500 m-2 p-1 rounded-xl" >
                {columns.map((column) => <option value={column} key={column} className="capitalize">
                  {column}
                </option> )}
              </select>
              </p>

              <button className="text-white font-bold text-xl w-1/2 text-center ">
                Generate Graph
              </button>
              </div>

             
          </div>
           <div>
                <PlottedWithPlot/>
              </div>
        </div>
      </div>
    </>
  );
}

export default App;

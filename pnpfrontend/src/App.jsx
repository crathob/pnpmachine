import { useState } from 'react';
import { goToFirstPlacement, generateGCode } from './clients/pnpClient';
import {FolderUp, Locate} from 'lucide-react';

function App()  {
  const [posx, setposx] = useState('');
  const [posy, setposy] = useState('');
  const [placementsFile, placementsfileSet] = useState('');
  const [packagesFile, packagesfileSet] = useState('');
  const [feedersFile, feedersfileSet] = useState('');

  const [count, setCount] = useState(0);

  const handleFirstClick = async () => {
    await goToFirstPlacement(posx, posy);
  }

  const handleGCodeClick = async () => {
    await generateGCode(placementsFile, packagesFile, feedersFile, posx, posy);
  }

return (
  <>
    <div className="bg-gradient-to-b from-green-900 to-green-700 h-screen w-screen">
      <div className="w-fit mx-auto py-2">
        <h1 className="text-3xl p-6 bg-white rounded-lg shadow-xl">
          <span className="font-bold text-green-900">Pick and Place</span> G-Code
        </h1>
        <div className="flex flex-col w-full mt-2">
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 items-center justify-center bg-white rounded-lg p-2">
              <h2>Placements</h2>
              <FolderUp size={20} className="text-green-900"/>
              <label htmlFor="fileInput" className=" cursor-pointer bg-green-700 text-white rounded-lg px-4 py-2 inline-block hover:bg-green-900">
                Browse
              </label>
              <input type="file" id="fileInput" className="hidden" onChange={(e) => placementsfileSet(e.target.files[0])} />
            </div>
            <div className="flex flex-col flex-1 items-center justify-center bg-white rounded-lg p-2">
              <h2>Packages</h2>
              <FolderUp size={20} className="text-green-900"/>
              <label htmlFor="fileInput2" className=" cursor-pointer bg-green-700 text-white rounded-lg px-4 py-2 inline-block hover:bg-green-900">
                Browse
              </label>
              <input type="file" id="fileInput2" className="hidden" onChange={(e) => packagesfileSet(e.target.files[0])} />
            </div>
            <div className="flex flex-col flex-1 items-center justify-center bg-white rounded-lg p-2">
              <h2>Feeders</h2>
              <FolderUp size={20} className="text-green-900"/>
              <label htmlFor="fileInput3" className=" cursor-pointer bg-green-700 text-white rounded-lg px-4 py-2 inline-block hover:bg-green-900">
                Browse
              </label>
              <input type="file" id="fileInput3" className="hidden" onChange={(e) => feedersfileSet(e.target.files[0])} />
            </div>
          </div>
          <div className="flex flex-col mt-2 bg-white rounded-lg p-2 items-center">
            <h2>Origin Location</h2>
            <Locate size={20} className="text-green-900"/>
            <div className="flex flex-row">
              <p>X</p>
              <input type="text" value={posx} placeholder="Position in mm" className="text-center" onChange={(e) => setposx(e.target.value)}/>
              <p>Y</p>
              <input type="text" value = {posy} placeholder="Position in mm" className="text-center" onChange={(e) => setposy(e.target.value)}/>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-fit mx-auto bg-white rounded-lg border-1 mt-2">
          <button id="Button1" className="text-white text-3xl bg-green-700 p-2 rounded-lg m-4 px-4" onClick={handleGCodeClick}>G-Code</button>
          <button className="text-green-700 border border-green-700 rounded-lg px-2 py-1 m-4 hover:bg-green-50" onClick={() => handleFirstClick}>First Placement</button>
        </div>
      </div>
    </div>
  </>
)
}

export default App;



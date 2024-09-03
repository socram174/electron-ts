import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [appVersion, setAppVersion] = useState('');

  useEffect(()=>{
    window.ipcRenderer.on('app-version', (_event, message) => {
      setAppVersion(message);
    })
  },[])

  return (
    <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-cyan-400 font-bold text-5xl">TAILWIND CSS</h1>
          <h3 className="text-green-400 font-bold">v{appVersion}</h3>
          <h3 className="text-white font-bold">2024</h3>
    </div>
  )
}

export default App

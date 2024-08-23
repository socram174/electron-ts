import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-cyan-400 font-bold text-5xl">TAILWIND</h1>
    </div>
  )
}

export default App

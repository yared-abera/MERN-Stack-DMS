import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"

function App() {
 
  return (
    <>
    {/* common header  */}

    <Routes>
      <Route path="/" element={<Home/>} />
 
     


    </Routes>



        
    </>
  )
}

export default App

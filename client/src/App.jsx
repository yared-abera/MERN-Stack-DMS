import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import LogIn from "./pages/auth/login";
import LogInLayout from "./components/auth/layout";
function App() {
 
  const theme = useSelector((state) => state.theme.mode);
      useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

  return (

     <div className= {`dark:bg-gray-800  ${theme === 'dark' ? 'dark' : ''}`}>
     {/* common header  */}
 
     <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<LogInLayout />}>
          <Route path="logIn" element={<LogIn />}/> 
        </Route>
      </Routes>
 
 
 
     
     </div>
  )
}

export default App

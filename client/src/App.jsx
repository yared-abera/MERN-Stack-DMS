import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import LogIn from "./pages/auth/login";

import LogInLayout from "./components/auth/layout";

function App() {
  return (
    <>
      {/* common header  */}
      <div className="overflow-hidden w-full flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<LogInLayout />}>
          <Route path="logIn" element={<LogIn />}/> 
        </Route>
      </Routes>
      </div>
    </>
  );
}

export default App;

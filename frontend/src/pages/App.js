import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "../components/Main";
import MyInfo from "../components/MyInfo";  
import Start from "../components/Start";  
import Signin from "../components/Signin";  
import Login from "../components/Login";  

const App = () => {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/chat" element={<Main />} />
          <Route path="/my-info" element={<MyInfo />} /> 
          <Route path="/signin" element={<Signin />} /> 
          <Route path="/Login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

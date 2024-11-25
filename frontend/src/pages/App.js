import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "../components/Main";
import MyInfo from "../components/MyInfo";  
import Start from "../components/Start";  
import Signin from "../components/Signin";  
import Login from "../components/Login";  
import AuthGuard from "../services/AuthGuard";

const App = () => {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/signin" element={<Signin />} /> 
          <Route path="/Login" element={<Login />} />

          <Route path="/chat" 
                element={
                <AuthGuard>
                  <Main />
                </AuthGuard>
              }
            />

          <Route path="/my-info" 
                element={
                <AuthGuard>
                  <MyInfo />
                </AuthGuard>
              }
            />
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;

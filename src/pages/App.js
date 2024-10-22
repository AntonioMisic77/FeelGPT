import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "../components/Main";
import MyInfo from "../components/MyInfo";  

const App = () => {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/my-info" element={<MyInfo />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;

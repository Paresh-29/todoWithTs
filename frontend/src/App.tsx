import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signin from "./component/Signin";
import SignUp from "./component/Signup";
import Todo from "./component/Todo";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </Router>
  );
};

export default App;

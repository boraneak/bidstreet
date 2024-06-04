import React from "react";
import { Route, Routes } from "react-router-dom";
import Signin  from "./components/auth/Signin";
import Home  from "./pages/Home";


export const Router: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/home" Component={Home}/>
        <Route path="/signin" Component={Signin} />
      </Routes>
    </div>
  );
};

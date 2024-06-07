import React from "react";
import { Route, Routes } from "react-router-dom";
import Signin from "./components/auth/Signin";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Signup from "./components/auth/Signup";
import Shops from "./components/shop/Shops";
import Auctions from "./components/auction/Auctions";
import MyAuctions from "./components/auction/MyAuction";
import MyShop from "./components/shop/MyShop";

export const Router: React.FC = () => {
  return (
    <div>
      <Menu />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/seller/shop" element={<MyShop />} />
        <Route path="//seller/auctions" element={<MyAuctions />} />
      </Routes>
    </div>
  );
};

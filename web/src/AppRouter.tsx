import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavigationBar from './components/layout/NavigationBar';
import SignInForm from './components/auth/SignInForm';
import SignUpForm from './components/auth/SignUpForm';
import ShopGrid from './components/shop/ShopGrid';
import AuctionGrid from './components/auction/AuctionGrid';
import UserShop from './components/shop/UserShop';
import UserAuction from './components/auction/UserAuction';
export const Router: React.FC = () => {
  return (
    <div>
      <NavigationBar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/shops" element={<ShopGrid />} />
        <Route path="/auctions" element={<AuctionGrid />} />
        <Route path="/seller/shop" element={<UserShop />} />
        <Route path="/seller/auctions" element={<UserAuction />} />
      </Routes>
    </div>
  );
};

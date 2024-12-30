import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/home-page';
import { NavigationBar } from '@/components/layout/navigation-bar';
import { LoginForm } from '@/features/auth/components/login-form';
import { AuctionGrid } from '@/features/auctions/components/auction-grid';
import { UserAuction } from '@/features/auctions/components/user-auction';
import { RegisterForm } from '@/features/auth/components/register-form';
import { ShopGrid } from '@/features/shops/components/shop-grid';
import { UserShop } from '@/features/shops/components/user-shop';
import useAuth from './hooks/useAuth';

export const Router: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavigationBar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected routes */}
        {isAuthenticated ? (
          <>
            <Route path="/home" element={<HomePage />} />
            <Route path="/shops" element={<ShopGrid />} />
            <Route path="/auctions" element={<AuctionGrid />} />
            <Route path="/seller/shop" element={<UserShop />} />
            <Route path="/seller/auctions" element={<UserAuction />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
};

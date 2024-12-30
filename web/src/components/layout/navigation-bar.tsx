import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '@/utils/auth';

const getActiveStyleForPath = (location: any, path: string) => {
  if (location.pathname === path) return { color: '#00ff00' };
  return { color: '#ffffff', fontWeight: 'bold', fontSize: '16px' };
};

export const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticatedUser = auth.isAuthenticated();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <div>
          <Link to="/shops">
            <Button
              style={{
                ...getActiveStyleForPath(location, '/shops'),
                textTransform: 'none',
              }}
            >
              Shops
            </Button>
          </Link>
          <Link to="/auctions">
            <Button
              style={{
                ...getActiveStyleForPath(location, '/auctions'),
                textTransform: 'none',
              }}
            >
              Auctions
            </Button>
          </Link>
        </div>
        <div style={{ position: 'absolute', right: '10px' }}>
          <span style={{ float: 'right' }}>
            {!authenticatedUser && (
              <span>
                <Link to="/register">
                  <Button
                    style={{
                      ...getActiveStyleForPath(location, '/register'),
                      textTransform: 'none',
                    }}
                  >
                    Register
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    style={{
                      ...getActiveStyleForPath(location, '/login'),
                      textTransform: 'none',
                    }}
                  >
                    Login
                  </Button>
                </Link>
              </span>
            )}
            {authenticatedUser && (
              <span>
                {authenticatedUser.seller && (
                  <>
                    <Link to="/seller/shop">
                      <Button
                        style={{
                          ...getActiveStyleForPath(location, '/seller/shop'),
                          textTransform: 'none',
                        }}
                      >
                        My Shop
                      </Button>
                    </Link>
                    <Link to="/seller/auctions">
                      <Button
                        style={{
                          ...getActiveStyleForPath(
                            location,
                            '/seller/auctions',
                          ),
                          textTransform: 'none',
                        }}
                      >
                        My Auctions
                      </Button>
                    </Link>
                  </>
                )}
                <Button
                  style={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }}
                  color="inherit"
                  onClick={() => {
                    auth.logout(() => navigate('/login'));
                  }}
                >
                  Logout
                </Button>
              </span>
            )}
          </span>
        </div>
      </Toolbar>
    </AppBar>
  );
};

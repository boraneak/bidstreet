import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../utils/auth';

const isActive = (location: any, path: string) => {
  if (location.pathname === path) return { color: '#00ff00' };
  return { color: '#ffffff', fontWeight: 'bold', fontSize: '16px' };
};

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.isAuthenticated();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <div>
          <Link to="/shops">
            <Button
              style={{ ...isActive(location, '/shops'), textTransform: 'none' }}
            >
              Shops
            </Button>
          </Link>
          <Link to="/auctions">
            <Button
              style={{
                ...isActive(location, '/auctions'),
                textTransform: 'none',
              }}
            >
              Auctions
            </Button>
          </Link>
        </div>
        <div style={{ position: 'absolute', right: '10px' }}>
          <span style={{ float: 'right' }}>
            {!user && (
              <span>
                <Link to="/signup">
                  <Button
                    style={{
                      ...isActive(location, '/signup'),
                      textTransform: 'none',
                    }}
                  >
                    Sign up
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button
                    style={{
                      ...isActive(location, '/signin'),
                      textTransform: 'none',
                    }}
                  >
                    Login
                  </Button>
                </Link>
              </span>
            )}
            {user && (
              <span>
                {user.seller && (
                  <>
                    <Link to="/seller/shop">
                      <Button
                        style={{
                          ...isActive(location, '/seller/shop'),
                          textTransform: 'none',
                        }}
                      >
                        My Shop
                      </Button>
                    </Link>
                    <Link to="/seller/auctions">
                      <Button
                        style={{
                          ...isActive(location, '/seller/auctions'),
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
                    auth.clearJwt(() => navigate('/'));
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

export default Menu;

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../utils/auth";

const isActive = (
  location: ReturnType<typeof useLocation>,
  path: string
): React.CSSProperties => {
  return {
    color: location.pathname === path ? "#bef67a" : "#ffffff",
  };
};

const isPartActive = (
  location: ReturnType<typeof useLocation>,
  path: string
): React.CSSProperties => {
  return {
    color: location.pathname.includes(path) ? "#bef67a" : "#ffffff",
  };
};

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.isAuthenticated();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <div>
          {/* <Link to="/home" style={isActive(location, "/home")}>
              bidstreet
          </Link> */}
          <Link to="/shops/all">
            <Button style={isActive(location, "/shops/all")}>shops</Button>
          </Link>
          <Link to="/auctions/all">
            <Button style={isActive(location, "/auctions/all")}>
             auctions
            </Button>
          </Link>
        </div>
        <div style={{ position: "absolute", right: "10px" }}>
          <span style={{ float: "right" }}>
            {!user && (
              <span>
                <Link to="/signup">
                  <Button style={isActive(location, "/signup")}>sign up</Button>
                </Link>
                <Link to="/signin">
                  <Button style={isActive(location, "/signin")}>login</Button>
                </Link>
              </span>
            )}
            {user && (
              <span>
                {user.seller && (
                  <>
                    <Link to="/seller/shops">
                      <Button style={isPartActive(location, "/seller/")}>
                        my shops
                      </Button>
                    </Link>
                    <Link to="/myauctions">
                      <Button style={isPartActive(location, "/myauctions")}>
                        my auctions
                      </Button>
                    </Link>
                  </>
                )}
                {/* <Link to={"/user/" + user.id}>
                  <Button
                    style={isActive(
                      location,
                      "/user/" + user.id
                    )}
                  >
                    profile
                  </Button>
                </Link> */}
                <Button
                  color="inherit"
                  onClick={() => {
                    auth.clearJwt(() => navigate("/home"));
                  }}
                >
                  sign out
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

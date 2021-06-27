import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";

import "./Header.css";

function Header() {
  const { currentUser, logout } = useAuth();
  const [hamburgerMenuPosition, setHamburgerMenuPosition] = useState(false);

  const handleLogout = () => {
    logout().catch((error) => console.log(`Error: ${error}`));
  };

  const changeHamburgerMenuPosition = () => {
    window.innerWidth < 992 &&
      setHamburgerMenuPosition(hamburgerMenuPosition ? false : true);
  };

  return (
    <div className="header">
      <Navbar expanded={hamburgerMenuPosition} bg="navy" expand="lg">
        <Navbar.Brand>
          <h1>
            <Link id="pageTitle" to={`/`} className="">
              Volunteer Land
            </Link>
          </h1>
        </Navbar.Brand>
        <Navbar.Toggle>
          <MenuIcon
            fontSize="large"
            style={{ color: "white" }}
            onClick={() => changeHamburgerMenuPosition()}
          />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="menuOptions ml-auto">
            <p className="navItem">
              <NavLink
                to={`/opportunities`}
                activeClassName="activeNavLink"
                className="navLink"
                onClick={() => changeHamburgerMenuPosition()}
              >
                Opportunities
              </NavLink>
            </p>

            <p className="navItem">
              <NavLink
                to={`/companies`}
                activeClassName="activeNavLink"
                className="navLink"
                onClick={() => changeHamburgerMenuPosition()}
              >
                Companies
              </NavLink>
            </p>

            {currentUser && (
              <>
                <p className="navItem">
                  <NavLink
                    to={`/myopportunities`}
                    activeClassName="activeNavLink"
                    className="navLink"
                    onClick={() => changeHamburgerMenuPosition()}
                  >
                    My Opportunities
                  </NavLink>
                </p>
              </>
            )}

            <p className="navItem">
              <NavLink
                to={`/newopportunity`}
                activeClassName="activeNavLink"
                className="navLink"
                onClick={() => changeHamburgerMenuPosition()}
              >
                I want volunteers!
              </NavLink>
            </p>

            {!currentUser && (
              <>
                <p className="navItem">
                  <NavLink
                    to={`/login`}
                    activeClassName="activeNavLink"
                    className="navLink"
                    onClick={() => changeHamburgerMenuPosition()}
                  >
                    Login
                  </NavLink>
                </p>

                <p className="navItem">
                  <NavLink
                    to={`/signup`}
                    activeClassName="activeNavLink"
                    className="navLink"
                    onClick={() => changeHamburgerMenuPosition()}
                  >
                    Signup
                  </NavLink>
                </p>
              </>
            )}

            {currentUser && (
              <>
                <p className="navItem">
                  <NavLink
                    to={`/profile`}
                    activeClassName="activeNavLink"
                    className="navLink"
                    onClick={() => changeHamburgerMenuPosition()}
                  >
                    {currentUser.first_name
                      ? currentUser.first_name
                      : currentUser.username}
                    's Profile
                  </NavLink>
                </p>
                <p className="navItem">
                  <span id="logoutLink">
                    <ExitToAppOutlinedIcon
                      id="logoutIcon"
                      onClick={() => {
                        changeHamburgerMenuPosition();
                        handleLogout();
                      }}
                    />
                  </span>
                </p>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default Header;

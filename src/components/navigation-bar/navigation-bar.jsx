import { Navbar, Container, Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setUser } from "../../redux/reducers/user/user";

import { Link } from "react-router-dom";

import "./navigation-bar.scss";

export const NavigationBar = () => {
  const user = useSelector((state) => state.user);

  const [collapsed, setCollapsed] = useState(true);
  const { pathname } = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    // Collapse the Navbar whenever the URL path changes
    setCollapsed(true);
  }, [pathname]);

  return (
    <Navbar bg="light" expand="lg" expanded={!collapsed}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          myFlix
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setCollapsed(!collapsed)}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Sign Up
                </Nav.Link>
              </>
            )}
            {user && (
              <>
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/users">
                  Profile
                </Nav.Link>

                <Nav.Link onClick={() => dispatch(setUser(null))}>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

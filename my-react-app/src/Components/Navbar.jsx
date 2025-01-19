import "./Navbar.css";
import Logo from "/src/assets/pngegg.png";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Link }   from "react-router-dom";
import useUserProfile from "./useUserProfile";





const Header=()=> {
  
  const { loginWithRedirect,isAuthenticated,logout,user,} = useAuth0();
  const { isApiCalled } = useUserProfile();

    const handleLogin = () => {
        loginWithRedirect(); // Call API on login or registration
    };


 
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      sticky="top"
      className="d-flex navbar-translucent"
    >
      <Container fluid>
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="brand-font ">
            EPL Match Prediction
            <img
              src={Logo}
              width="150"
              height="70"
              className="d-inline-block align"
              alt="EPL LOGO"
            />
          </Navbar.Brand>
        </Container>

        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          className="border-color:white"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto ">
            <Nav.Link as={Link} to="/" className="text-white custom-nav-link">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/Shop" className="text-white custom-nav-link">
              Shop
            </Nav.Link>


            <li>
              
                 {isAuthenticated && <div className="ptag">{user.name}</div>}
              
            </li>
            

            {isAuthenticated ? (
              <li>
                <button className="log-button" onClick={() =>
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    })
                  }
                >
                  Log Out
                </button>
              </li>
            ) : (
              <li>
                <button className="log-button" onClick={()=>handleLogin()}>Log In</button>
                
              </li>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

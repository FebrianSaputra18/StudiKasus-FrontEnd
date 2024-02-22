import { Container, Nav, Navbar } from "react-bootstrap";

import { navLinks } from "../data";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const NavbarComponent = () => {
  const [changeColor, setChangeColor] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const full_name = localStorage.getItem("authName");
  // console.log(token, "token dari localStorage");

  function clearLocalStorage() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authName");
  }
  const changeBackgroundNav = () => {
    if (window.scrollY > 10) {
      setChangeColor(true);
    } else {
      setChangeColor(false);
    }
  };
  const handleLogout = () => {
    clearLocalStorage();

    axios
      .post("http://localhost:3000/auth/logout")
      .then((response) => {
        console.log(response.data.message);
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        return error.status(400).send({
          message: "Invalid credentials",
        });
      });
  };
  useEffect(() => {
    changeBackgroundNav();

    window.addEventListener("scroll", changeBackgroundNav);
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoggedIn(true);
        setUserData(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    }
    fetchData();
  }, [token]);

  return (
    <div>
      <Navbar expand="lg" className={changeColor ? "color-active" : ""}>
        <Container>
          <Navbar.Brand href="/" className="fs-4 fw-bold">
            GulungTikar <span style={{ color: "red" }}>Store</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto text-center">
              {navLinks.map((link) => {
                return (
                  <div className="nav-link" key={link.id}>
                    <NavLink
                      to={link.path}
                      className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "active" : ""
                      }
                      end
                    >
                      {link.text}
                    </NavLink>
                  </div>
                );
              })}
            </Nav>
            {userData || loggedIn ? (
              <div className="text-center d-flex align-items-center">
                <Link to="/shop" style={{ textDecoration: "none" }}>
                  <button className="btn btn-danger rounded-1 me-2 d-flex">
                    <i className="bi bi-person-circle pe-2"></i>
                    {full_name}
                  </button>
                </Link>
                <Link to="/">
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger rounded-1"
                  >
                    Logout
                  </button>
                </Link>
              </div>
            ) : (
              <div className="text-center d-flex align-items-center">
                <Link to="/login">
                  <button className="btn btn-outline-danger mx-2 rounded-1">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="btn btn-danger rounded-1">Register</button>
                </Link>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;

import React, { useContext, useEffect, useState } from "react";
import {
  Navbar,
  Container,
  Offcanvas,
  Nav,
  Form,
  Button,
} from "react-bootstrap";
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  LOGIN_ROUTE,
  STORE_ROUTE,
} from "../utils/const";
import "../style/App.css";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaUserShield,
  FaShoppingCart,
  FaSignInAlt,
} from "react-icons/fa";
import "../style/NavBar.css";

const NavBar = observer(() => {
  const { user, device } = useContext(Context);
  const [searchQuery, setSearchQuery] = useState("");
  const [timer, setTimer] = useState(null);

  const navigate = useNavigate();
  const expand = "xxl";

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = window.setTimeout(() => {
      device.setSearch(searchQuery);
    }, 500);

    setTimer(newTimer);
  }, [searchQuery]);

  return (
    <Navbar key={expand} expand={expand} style={{ backgroundColor: "#f7f7f7" }}>
      <Container fluid>
        <NavLink style={{ textDecoration: "none" }} to={STORE_ROUTE}>
          <div className="mainLink">Online store</div>
        </NavLink>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              Offcanvas
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3" />
            <Form className="d-flex flex-column align-items-center search">
              <div className="d-flex gap-2">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={searchQuery} // Підключаємо локальний стан
                  onChange={(e) => setSearchQuery(e.target.value)} // Обробник для зміни пошукового запиту
                />
                {/* <Button
                  variant="outline-dark"
                  className="custom-button"
                  onClick={handleSearchSubmit}
                >
                  Search
                </Button> */}
              </div>
            </Form>
            <Button
              title="Basket"
              className="custom-button"
              variant="none"
              onClick={() => navigate(BASKET_ROUTE)}
            >
              <FaShoppingCart size={20} />
            </Button>
            {user.isAuth ? (
              <Nav className="ml-auto" style={{ height: 40 }}>
                <Button
                  title="Log out"
                  className="custom-button"
                  variant="none"
                  onClick={logOut}
                >
                  <FaSignOutAlt size={20} />
                </Button>
                {user.user.role === "ADMIN" && (
                  <Button
                    title="Admin"
                    className="custom-button"
                    variant="none"
                    onClick={() => navigate(ADMIN_ROUTE)}
                  >
                    <FaUserShield size={20} />
                  </Button>
                )}
              </Nav>
            ) : (
              <Nav className="ml-auto">
                <Button
                  title="Sing in"
                  className="custom-button"
                  variant="none"
                  onClick={() => navigate(LOGIN_ROUTE)}
                >
                  <FaSignInAlt size={20} />
                </Button>
              </Nav>
            )}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
});

export default NavBar;

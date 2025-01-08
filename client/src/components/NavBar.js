import React, { useContext } from "react";
import {
  Navbar,
  Container,
  Offcanvas,
  Nav,
  Form,
  Button,
} from "react-bootstrap";
import { ADMIN_ROUTE, LOGIN_ROUTE, STORE_ROUTE } from "../utils/const";
import "../style/App.css";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { NavLink, useNavigate } from "react-router-dom";

const NavBar = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const expand = "xxl";
  return (
    <Navbar key={expand} expand={expand} style={{ backgroundColor: "#f7f7f7" }}>
      <Container fluid>
        <NavLink style={{color: "black"}} to={STORE_ROUTE}>Online store</NavLink>
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
            <Form className="d-flex justify-content-center">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-dark" className="custom-button">
                Search
              </Button>
              <Button
                className="custom-button"
                variant="outline-dark"
                onClick={() => navigate(LOGIN_ROUTE)}
              >
                Authorization
              </Button>
              {user.isAuth && (
                <Button
                  className="custom-button"
                  variant="outline-dark"
                  onClick={() => navigate(ADMIN_ROUTE)}
                >
                  Admin
                </Button>
              )}
            </Form>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
});

export default NavBar;

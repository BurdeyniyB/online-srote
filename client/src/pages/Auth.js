import React from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { NavLink, useLocation } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from "../utils/const";

const Auth = () => {
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? "Authorization" : "Registrarion"}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-3"
            type="email"
            placeholder="Enter your email"
          />
          <Form.Control
            className="mt-3"
            type="password"
            placeholder="Enter your password"
          />
          <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
            {isLogin ? 
              <div>
                Don't have an account?{" "}
                <NavLink to={REGISTRATION_ROUTE}>Go to registration</NavLink>
              </div>
            :
            <div>
            Do you have an account?{" "}
            <NavLink to={LOGIN_ROUTE}>Log in</NavLink>
          </div>
            }
            <Button variant={"outline-success"}>Login</Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

export default Auth;

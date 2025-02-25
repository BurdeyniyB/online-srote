import React, { useContext, useState } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTER_ROUTE, STORE_ROUTE } from "../utils/const";
import { login, registration } from "../http/userApi";
import { observer } from "mobx-react-lite";
import { Context } from "..";

const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const click = async () => {
    try {
      let data;
      if (isLogin) {
        data = await login(email, password);
      } else {
        data = await registration(email, password);
      }
      user.setUser(data);
      user.setIsAuth(true);
      navigate(STORE_ROUTE);
    } catch (e) {
      alert(e.response.data);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? "Authorization" : "Registrarion"}</h2>
        <Form
          className="d-flex flex-column"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Запобігаємо перезавантаженню сторінки
              click();
            }
          }}
        >
          <Form.Control
            className="mt-3"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
            {isLogin ? (
              <div>
                Don't have an account?{" "}
                <NavLink to={REGISTER_ROUTE}>Go to registration</NavLink>
              </div>
            ) : (
              <div>
                Do you have an account?{" "}
                <NavLink to={LOGIN_ROUTE}>Log in</NavLink>
              </div>
            )}
            <Button
              className="mt-3"
              variant={"outline-success"}
              onClick={click}
            >
              {isLogin ? "Login" : "Registration"}
            </Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});

export default Auth;

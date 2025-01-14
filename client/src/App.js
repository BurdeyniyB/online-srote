import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from ".";
import { Spinner } from "react-bootstrap";
import { check } from "./http/userApi";

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setTimeout(() => {
      if (token) {
        check()
          .then(data => {
            if (data) {
              user.setUser(data);  
              user.setIsAuth(true);
            }
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false); 
      }
    }, 1000);
  }, [user]);
  
  

  if (loading) {
    return <Spinner animation="grow" />;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;

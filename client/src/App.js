import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { observer } from "mobx-react-lite";
import { Context } from ".";
import Loader from "./components/Loader";
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
              user.setUser(data || {});
              user.setIsAuth(true);
            }
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }, 2000);
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
});

const MainLayout = observer(() => {
  const location = useLocation(); // Move useLocation here
  const hideFooterRoutes = ["/login", "/register", "/admin"];
  const showFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />
      <div style={{ flex: 1 }}> {/* Ensures content takes full height before Footer */}
        <AppRouter />
      </div>
      {showFooter && <Footer />}
    </div>
  );
});

export default App;

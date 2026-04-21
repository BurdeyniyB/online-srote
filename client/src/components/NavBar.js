import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  INDEX_ROUTE,
  LOGIN_ROUTE,
  STORE_ROUTE,
} from "../utils/const";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import {
  FaSignOutAlt,
  FaUserShield,
  FaShoppingCart,
  FaUser,
  FaHome,
  FaListUl,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { fetchBasket } from "../http/basketAPI";
import "../style/NavBar.css";
import Filter from "./Filter";

const NavBar = observer(() => {
  const { user, basket } = useContext(Context);
  const basketCount = basket.basketDevices.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [basketLoaded, setBasketLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAuth && user.user.id) {
      fetchBasket(user.user.id)
        .then((data) => basket.setBasketDevices(data))
        .finally(() => setBasketLoaded(true));
    } else {
      setBasketLoaded(true);
    }
  }, [user.isAuth, user.user.id, basket]);

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem("token");
    basket.clearBasket();
  };

  return (
    <>
      {/* Верхній навбар */}
      <div className="navbar">
        <div className="navbar-container">
          <div className="mainLink" onClick={() => navigate(INDEX_ROUTE)}>
            Tech<span className="mainLink-accent">.Hub</span>
          </div>
          {/* Кнопки праворуч на великих екранах */}
          <div className="desktop-buttons">
            <button
              className="custom-button"
              title="Home"
              onClick={() => navigate(INDEX_ROUTE)}
            >
              <FaHome size={20} />
            </button>
            <button
              className="custom-button"
              title="Catalog"
              onClick={() => navigate(STORE_ROUTE)}
            >
              <FaListUl size={20} />
            </button>
            <div className="basket-btn-wrapper">
              <button
                className="custom-button"
                title="Basket"
                onClick={() => navigate(BASKET_ROUTE)}
              >
                <FaShoppingCart size={20} />
              </button>
              {basketLoaded && basketCount > 0 && (
                <span className="basket-badge">{basketCount}</span>
              )}
            </div>

            {user.isAuth ? (
              <>
                <button
                  className="custom-button"
                  title="Log out"
                  onClick={logOut}
                >
                  <FaSignOutAlt size={20} />
                </button>
                {user.user.role === "ADMIN" && (
                  <button
                    className="custom-button"
                    title="Admin"
                    onClick={() => navigate(ADMIN_ROUTE)}
                  >
                    <FaUserShield size={20} />
                  </button>
                )}
              </>
            ) : (
              <button
                className="custom-button"
                title="Sign in"
                onClick={() => navigate(LOGIN_ROUTE)}
              >
                <FaUser size={20} />
              </button>
            )}
          </div>
          <button className="menu-button" onClick={() => setMenuOpen(true)}>
            <FaBars size={24} />
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-button" onClick={() => setMenuOpen(false)}>
          <FaTimes size={24} />
        </button>
        <Filter />
        {user.isAuth ? (
          <>
            <button className="mobile-menu-button" onClick={logOut}>
              Log out
            </button>
            {user.user.role === "ADMIN" && (
              <button
                className="mobile-menu-button"
                onClick={() => navigate(ADMIN_ROUTE)}
              >
                Admin
              </button>
            )}
          </>
        ) : (
          <button
            className="mobile-menu-button"
            onClick={() => navigate(LOGIN_ROUTE)}
          >
            Sign in
          </button>
        )}
      </div>

      {/* Нижній контейнер для мобільних екранів */}
      <div className="mobile-bottom-nav">
        <button
          className="mobile-button"
          title="Home"
          onClick={() => navigate(INDEX_ROUTE)}
        >
          <FaHome size={24} />
        </button>
        <button
          className="mobile-button"
          title="Catalog"
          onClick={() => navigate(STORE_ROUTE)}
        >
          <FaListUl size={24} />
        </button>
        <div className="basket-btn-wrapper">
          <button
            className="mobile-button"
            title="Basket"
            onClick={() => navigate(BASKET_ROUTE)}
          >
            <FaShoppingCart size={24} />
          </button>
          {basketLoaded && basketCount > 0 && (
            <span className="basket-badge">{basketCount}</span>
          )}
        </div>

        {user.isAuth ? (
          <>
            <button className="mobile-button" title="Log out" onClick={logOut}>
              <FaSignOutAlt size={24} />
            </button>
            {user.user.role === "ADMIN" && (
              <button
                className="mobile-button"
                title="Admin"
                onClick={() => navigate(ADMIN_ROUTE)}
              >
                <FaUserShield size={24} />
              </button>
            )}
          </>
        ) : (
          <button
            className="mobile-button"
            title="Sign in"
            onClick={() => navigate(LOGIN_ROUTE)}
          >
            <FaUser size={24} />
          </button>
        )}
      </div>
    </>
  );
});

export default NavBar;

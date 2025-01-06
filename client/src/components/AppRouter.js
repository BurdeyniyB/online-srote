import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from "../routes";
import { STORE_ROUTE } from "../utils/const";
import { Context } from "../index";

const AppRouter = () => {
  const {user} = useContext(Context);

  console.log(user)
  return (
    <Routes>
      {user.isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to={STORE_ROUTE} replace />} />
    </Routes>
  );
};

export default AppRouter;

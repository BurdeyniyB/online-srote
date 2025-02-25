import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Basket from "./pages/Basket";
import DevicePage from "./pages/DevicePage";
import Store from "./pages/Store";
import Index from"./pages/Index";
import { ADMIN_ROUTE, BASKET_ROUTE, STORE_ROUTE, DEVICE_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, INDEX_ROUTE } from "./utils/const";

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: Admin,
  }
];

export const publicRoutes = [
  {
    path: INDEX_ROUTE,
    Component: Index,
  },
  {
    path: STORE_ROUTE,
    Component: Store,
  },
  {
    path: LOGIN_ROUTE,
    Component: Auth,
  },
  {
    path: REGISTER_ROUTE,
    Component: Auth,
  },
  {
    path: DEVICE_ROUTE + "/:id",
    Component: DevicePage,
  },
  {
    path: BASKET_ROUTE,
    Component: Basket,
  },
];

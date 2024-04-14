import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound";

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

export default function Routes() {
  return (
    <RouterProvider router={router} fallbackElement={<h1>Loading...</h1>} />
  );
}

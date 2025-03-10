import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import routes from "./routes/routes.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppProvider } from "./context/context.jsx";
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </AppProvider>
  </StrictMode>
);
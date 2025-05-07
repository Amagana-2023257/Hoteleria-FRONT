import React from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes.jsx";
import { Toaster } from "react-hot-toast";
import 'bootstrap/dist/css/bootstrap.min.css';

export const App = () => {
  const element = useRoutes(routes);

  return (
    <div className="container-fluid p-0">
      {element}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;

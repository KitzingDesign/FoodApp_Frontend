import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/login/Login.jsx";
import Welcome from "./features/auth/welcome/Welcome.jsx"; // change to real dashboard
import RequireAuth from "./features/auth/RequireAuth";
import Register from "./features/auth/register/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="welcome" element={<Welcome />} />
          {/* add list of recipes here */}
          <Route path="recipes" element={<div>Recipes</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/login/Login.jsx";
import Welcome from "./features/welcome/Welcome.jsx"; // change to real dashboard
import RequireAuth from "./features/auth/RequireAuth";
import AddRecipe from "./features/recipes/addRecipe.jsx/AddRecipe.jsx";
import Register from "./features/auth/register/Register";
import DashboardLayout from "./components/DashboardLayout.jsx";

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
          {/* dashboard */}
          <Route path="/welcome" element={<DashboardLayout />}>
            <Route path=":userId" element={<Welcome />} />
            <Route path=":userId/create" element={<AddRecipe />} />
            {/* add list of recipes here */}
            <Route path="recipes" element={<div>Recipes</div>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

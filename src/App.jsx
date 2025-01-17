// Importing routing components from react-router-dom
import { Route, Routes } from "react-router-dom";

// Importing layout components
import Layout from "./components/Layout";
import Public from "./components/Public";

// Importing authentication-related components
import Login from "./features/auth/login/Login.jsx";
import Register from "./features/auth/register/Register";
import ForgotPassword from "./features/auth/forgotPassword/ForgotPassword.jsx";
import RequireAuth from "./features/auth/RequireAuth";
import PersistLogin from "./features/auth/PersistLogin.jsx";

// Importing dashboard and user-related components
import DashboardLayout from "./components/dashboard/DashboardLayout.jsx";
import Welcome from "./features/welcome/Welcome.jsx"; // Placeholder for the real dashboard
import Profile from "./features/profile/Profile.jsx";

// Importing collection-related components
import Collections from "./features/collections/collectionPage/Collections.jsx";

// Importing recipe-related components
import CurrentRecipe from "./features/recipes/currentRecipe/CurrentRecipe.jsx";
import AllRecipes from "./features/recipes/allRecipes/AllRecipesPage.jsx";

// Importing static and error components
import TermsAndConditions from "./components/legal/TermsAndConditions.jsx";
import PageNotFound from "./components/404/PageNotFound.jsx";

// Import the viewport script
import "./viewport.js";

function App() {
  return (
    <Routes>
      {/* Main layout for public routes */}

      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="terms" element={<TermsAndConditions />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* Protected routes (only accessible when logged in) */}
        <Route element={<PersistLogin />}>
          {/* Persist login across sessions */}
          <Route element={<RequireAuth />}>
            {/* Guard routes that require authentication */}
            {/* Dashboard layout (parent route for authenticated user views) */}
            <Route path="/welcome" element={<DashboardLayout />}>
              {/* User dashboard */}
              <Route path=":userId" element={<Welcome />} />
              {/* Recipe routes */}
              <Route path=":userId/:recipeId" element={<CurrentRecipe />} />
              <Route
                path="collections/:collectionId"
                element={<AllRecipes />}
              />
              <Route path="recipes" element={<div>Recipes</div>} />{" "}
              {/* Placeholder for recipes listing */}
              {/* Collection routes */}
              <Route path="collections" element={<Collections />} />
              {/* Profile route */}
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all route for 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

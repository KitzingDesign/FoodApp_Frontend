import "./App.css";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/login/Login.jsx";
import Welcome from "./features/welcome/Welcome.jsx"; // change to real dashboard
import RequireAuth from "./features/auth/RequireAuth";
import AddRecipe from "./features/recipes/addRecipe.jsx/AddRecipe.jsx";
import Register from "./features/auth/register/Register";
import DashboardLayout from "./components/dashboard/DashboardLayout.jsx";
import Collections from "./features/collections/collectionPage/Collections.jsx";
import CurrentRecipe from "./features/recipes/currentRecipe/CurrentRecipe.jsx";
import AddCollection from "./features/collections/addCollection/AddCollection.jsx";
import AllRecipes from "./features/recipes/allRecipes.jsx/allRecipes.jsx";
import UpdateRecipe from "./features/recipes/updateRecipe/UpdateRecipe.jsx";
import EditCollection from "./features/collections/editCollection/EditCollection.jsx";
import Profile from "./features/profile/Profile.jsx";
import TermsAndConditions from "./components/legal/TermsAndConditions.jsx";
import PersistLogin from "./features/auth/PersistLogin.jsx";
import PageNotFound from "./components/404/PageNotFound.jsx";
import ForgotPassword from "./features/auth/forgotPassword/ForgotPassword.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="terms" element={<TermsAndConditions />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            {/* dashboard */}
            <Route path="/welcome" element={<DashboardLayout />}>
              <Route path=":userId" element={<Welcome />} />
              <Route path=":userId/create" element={<AddRecipe />} />

              <Route path=":userId/:recipeId" element={<CurrentRecipe />} />
              <Route
                path=":userId/:recipeId/update"
                element={<UpdateRecipe />}
              />
              <Route path="collections" element={<Collections />} />
              <Route path="collections/add" element={<AddCollection />} />
              <Route
                path="collections/:collectionId"
                element={<AllRecipes />}
              />
              <Route path="profile" element={<Profile />} />

              <Route
                path="collections/:collectionId/edit"
                element={<EditCollection />}
              />
              <Route
                path="collections/:collectionId/create"
                element={<AddRecipe />}
              />
              {/* add list of recipes here */}
              <Route path="recipes" element={<div>Recipes</div>} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
  selectCurrentUserId,
} from "../auth/authSlice";
import { Link } from "react-router-dom";
import SideBar from "../../components/SideBar";
import styles from "./Welcome.module.css";
import AddRecipe from "../recipes/addRecipe.jsx/AddRecipe";
import AllRecipes from "../recipes/allRecipes.jsx/allRecipes";

const Welcome = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const userId = useSelector(selectCurrentUserId);

  //This should mabye be stored in authSlice

  const content = <AllRecipes />;
  return content;
};

export default Welcome;

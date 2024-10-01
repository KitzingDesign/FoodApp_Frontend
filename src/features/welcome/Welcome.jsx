import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
  selectCurrentUserId,
} from "../auth/authSlice";
import AllRecipes from "../recipes/allRecipes.jsx/allRecipes";

const Welcome = () => {
  const userId = useSelector(selectCurrentUserId);

  const content = <AllRecipes />;
  return content;
};

export default Welcome;

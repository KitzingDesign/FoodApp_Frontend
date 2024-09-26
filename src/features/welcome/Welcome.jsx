import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
  selectCurrentUserId,
} from "../auth/authSlice";
import AllRecipes from "../recipes/allRecipes.jsx/allRecipes";

import { useEffect, useState } from "react";
import { useGetCollectionsQuery } from "../collections/collectionsApiSlice";
import { setCollection } from "../collections/collectionSlice";
import { useGetRecipesQuery } from "../recipes/recipesApiSlice";

const Welcome = () => {
  const userId = useSelector(selectCurrentUserId);

  const content = <AllRecipes />;
  return content;
};

export default Welcome;

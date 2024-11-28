import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDeleteRecipeMutation } from "../features/recipes/recipesApiSlice";
import { setActiveTitle } from "../components/dashboard/dashboardSlice";

// Custom hook to handle recipe deletion
const useDeleteRecipe = (recipeId, userId) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Delete recipe mutation hook
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();

  const handleDelete = async () => {
    try {
      await deleteRecipe({ id: recipeId });
      dispatch(setActiveTitle({ activeTitle: "All Recipes" }));
      navigate(`/welcome/${userId}`);
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  return { handleDelete, isDeleting };
};

export default useDeleteRecipe;

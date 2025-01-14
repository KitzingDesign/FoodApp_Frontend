import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useAddNewRecipeMutation,
  useAddNewInstructionMutation,
  useAddNewIngredientMutation,
} from "../recipesApiSlice.jsx";
import { setActiveTab } from "../../../components/Sidebar/sidebarSlice.jsx";
import { setActiveTitle } from "../../../components/dashboard/dashboardSlice.jsx";

const useAddRecipe = ({ userId, collections }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addRecipe, { isLoading: isAdding }] = useAddNewRecipeMutation();
  const [addInstruction] = useAddNewInstructionMutation();
  const [addIngredient] = useAddNewIngredientMutation();
  const [errMsg, setErrMsg] = useState("");

  const addRecipeHandler = async (formData, imageFile, resetForm, onClose) => {
    setErrMsg("");

    if (!formData.title) {
      setErrMsg("Title is required");
      return;
    }

    const recipeFormData = new FormData();
    recipeFormData.append("title", formData.title);
    recipeFormData.append("description", formData.description);
    recipeFormData.append("user_id", userId);
    recipeFormData.append("collection_id", formData.collection_id);
    recipeFormData.append("image_url", formData.image_url);

    if (imageFile) {
      recipeFormData.append("image", imageFile);
    }

    try {
      const newRecipe = await addRecipe({ recipeFormData }).unwrap();

      // Add instructions
      const areAllInstructionsEmpty = formData.instructions.every(
        (instruction) => instruction.trim() === ""
      );

      if (areAllInstructionsEmpty) {
        await addInstruction({
          recipe_id: newRecipe.recipe_id,
          instruction_text: "No instruction provided",
          step_number: 0,
        }).unwrap();
      } else {
        await Promise.all(
          formData.instructions
            .filter((instruction) => instruction.trim() !== "")
            .map((instruction, index) =>
              addInstruction({
                recipe_id: newRecipe.recipe_id,
                instruction_text: instruction,
                step_number: index,
              }).unwrap()
            )
        );
      }

      // Add ingredients
      const areAllIngredientsEmpty = formData.ingredients.every(
        (ingredient) => ingredient.trim() === ""
      );

      if (areAllIngredientsEmpty) {
        await addIngredient({
          recipe_id: newRecipe.recipe_id,
          name: "No ingredient provided",
        }).unwrap();
      } else {
        await Promise.all(
          formData.ingredients
            .filter((ingredient) => ingredient.trim() !== "")
            .map((ingredient) =>
              addIngredient({
                recipe_id: newRecipe.recipe_id,
                name: ingredient,
              }).unwrap()
            )
        );
      }

      // Set active tab and title if a collection is selected
      if (formData.collection_id) {
        const collection = collections.find(
          (item) => item.collection_id === formData.collection_id
        );
        dispatch(setActiveTab({ activeTab: formData.collection_id }));
        dispatch(setActiveTitle({ activeTitle: collection.name }));
      }

      // Navigate to the appropriate page
      navigate(
        formData.collection_id
          ? `/welcome/collections/${formData.collection_id}`
          : `/welcome/${userId}`
      );

      resetForm();
      onClose();
    } catch (err) {
      setErrMsg("Failed to add recipe");
      console.error(err);
    }
  };

  return {
    addRecipeHandler,
    isAdding,
    errMsg,
  };
};

export default useAddRecipe;

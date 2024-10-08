import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import styles from "./AllRecipes.module.css";

import { selectCurrentUserId } from "../../auth/authSlice";
import { useGetRecipesQuery } from "../recipesApiSlice";
import RecipeCard from "../../../components/RecipeCard";
import { useGetCollectionRecipesQuery } from "../../collections/collectionsApiSlice";
import Modal from "../addRecipe.jsx/ModalAddRecipe";

import Button from "../../../UI/Button";

const AllRecipes = () => {
  const { collectionId } = useParams(); // Extract collection ID from URL
  const userId = Number(useSelector(selectCurrentUserId));

  // Modal state to handle open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle modal open/close
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch recipes based on the collection ID or user ID
  const {
    data: recipes = [],
    error,
    isLoading,
  } = collectionId
    ? useGetCollectionRecipesQuery(collectionId)
    : useGetRecipesQuery(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const content = (
    <div className={styles.container}>
      <div className={styles.addRecipeLink}>
        <Button
          variant="outline"
          size="medium"
          onClick={openModal}
          aria-label="Add a new recipe"
        >
          Add Recipe
        </Button>
      </div>
      <div className={styles.gridContainer}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.recipe_id} recipe={recipe} />
        ))}
      </div>
      {/* Modal for adding a new recipe */}
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );

  return content;
};

export default AllRecipes;

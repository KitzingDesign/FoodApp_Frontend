import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import styles from "./AllRecipes.module.css";

import { selectCurrentUserId } from "../../auth/authSlice";
import { useGetRecipesQuery } from "../recipesApiSlice";
import RecipeCard from "../../../components/RecipeCard";
import { useGetCollectionRecipesQuery } from "../../collections/collectionsApiSlice";
import Modal from "../../../components/Modal/Modal";
import AddRecipeContent from "../addRecipe.jsx/AddRecipeContent";
import EditRecipeModal from "../updateRecipe/EditRecipeContent";

import Button from "../../../UI/Button";
import EditCollectionContent from "../../collections/editCollection/EditCollectionContent";

const AllRecipes = () => {
  const { collectionId } = useParams(); // Extract collection ID from URL
  const userId = Number(useSelector(selectCurrentUserId));

  // Modal state to handle open/close
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Function to handle modal open/close
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to handle modal open/close
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

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
        </Button>{" "}
        {collectionId && (
          <Button
            variant="outline"
            size="medium"
            onClick={openEditModal}
            aria-label="Add a new recipe"
          >
            Edit Collection
          </Button>
        )}
      </div>
      {recipes.length ? (
        <div className={styles.gridContainer}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.recipe_id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className={styles.placeholderContainer}>
          <img src="/grocery-bag.png" alt="Image of a grocery bag" />
          <h3>No Recipes Yet...</h3>
          <p>
            Unleash your inner chef—create your first recipe and embark on a
            delicious <br />
            journey with your digital cookbook!
          </p>
        </div>
      )}
      {/* Modal for adding a new recipe */}
      <Modal isOpen={isModalOpen} title="Add Recipe" onClose={closeModal}>
        <AddRecipeContent onClose={closeModal} />
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        title="Edit Collection"
        onClose={closeEditModal}
      >
        <EditCollectionContent onClose={closeEditModal} />
      </Modal>
    </div>
  );

  return content;
};

export default AllRecipes;

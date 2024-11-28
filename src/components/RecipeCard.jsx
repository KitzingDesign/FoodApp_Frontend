import { useState } from "react";
import styles from "./RecipeCard.module.css";
import { Link } from "react-router-dom";
import { setActiveTitle } from "./dashboard/dashboardSlice";
import { useGetOneCollectionQuery } from "../features/collections/collectionsApiSlice";
import { useDispatch } from "react-redux";
import RecipeCardMenu from "./menu/RecipeCardMenu";

import useDeleteRecipe from "../hooks/useDeleteRecipe";
import Modal from "./Modal/Modal";
import EditRecipeContent from "../features/recipes/updateRecipe/EditRecipeContent";

const RecipeCard = ({ recipe, openEditModal }) => {
  // State to handle modal open/close for editing a recipe
  const [isEditRecipeModalOpen, setIsEditRecipeModalOpen] = useState(false);
  // Function to handle modal open/close for editing a recipe
  const openEditRecipeModal = () => setIsEditRecipeModalOpen(true);
  const closeEditRecipeModal = () => setIsEditRecipeModalOpen(false);

  const {
    data: collection,
    error,
    isLoading,
  } = useGetOneCollectionQuery(
    { id: recipe.collection_id },
    { skip: !recipe.collection_id }
  );

  // Use custom hook to handle deletion
  const { handleDelete, isDeleting } = useDeleteRecipe(
    recipe.recipe_id,
    recipe.user_id
  );

  const dispatch = useDispatch();
  return (
    <div className={styles.outerContainer}>
      <div className={styles.menuButton}>
        <RecipeCardMenu
          recipe={recipe}
          deleteClick={handleDelete}
          isDeleting={isDeleting}
          editClick={openEditRecipeModal}
        />
      </div>
      <Link
        to={`/welcome/${recipe.user_id}/${recipe.recipe_id}`}
        className={styles.cardContainer}
        onClick={() => {
          dispatch(setActiveTitle({ activeTitle: "" }));
        }}
      >
        <div className={styles.imgContainer}>
          {collection ? (
            <div className={styles.collectionTab}>
              <p>{collection.name}</p>
            </div>
          ) : null}

          {recipe.image_url ? (
            <img className={styles.foodImg} src={recipe.image_url} />
          ) : (
            <img className={styles.placeholderImg} src="/grocery-bag.png" />
          )}
        </div>
        <div className={styles.textContainer}>
          <h3>
            {recipe.title.length > 50
              ? `${recipe.title.substring(0, 50)}...`
              : recipe.title}
          </h3>
        </div>
      </Link>
      <Modal
        isOpen={isEditRecipeModalOpen}
        title="Edit Recipe"
        onClose={closeEditRecipeModal}
      >
        <EditRecipeContent
          recipe_id={recipe.recipe_id}
          onClose={closeEditRecipeModal}
        />
      </Modal>
    </div>
  );
};

export default RecipeCard;

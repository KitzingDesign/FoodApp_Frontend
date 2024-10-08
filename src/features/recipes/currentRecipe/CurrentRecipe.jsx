import { useParams } from "react-router-dom";
import { useEffect } from "react";

// Styles
import styles from "./CurrentRecipe.module.css";

// API hooks
import { useGetOneRecipeQuery } from "../recipesApiSlice";
import { useGetIngredientsQuery } from "../../ingredients/ingredientsApiSlice";
import { useGetInstructionsQuery } from "../../instructions/instructionsApiSlice";
import { useGetOneCollectionQuery } from "../../collections/collectionsApiSlice";
import Button from "../../../UI/Button";

const CurrentRecipe = () => {
  const { recipeId } = useParams();

  // Fetch recipe details, collection, ingredients, and instructions
  const {
    data: recipe,
    error: recipeError,
    isLoading: isLoadingRecipe,
  } = useGetOneRecipeQuery({ id: recipeId });

  const {
    data: collection,
    error: collectionError,
    isLoading: isLoadingCollection,
  } = useGetOneCollectionQuery(
    { id: recipe?.collection_id },
    { skip: !recipe?.collection_id }
  );

  const {
    data: ingredients,
    error: ingredientsError,
    isLoading: isLoadingIngredients,
    refetch: refetchIngredients,
  } = useGetIngredientsQuery({ id: recipeId });

  const {
    data: instructions,
    error: instructionsError,
    isLoading: isLoadingInstructions,
    refetch: refetchInstructions,
  } = useGetInstructionsQuery({ id: recipeId });

  // Loading and error handling
  const isLoading =
    isLoadingRecipe || isLoadingIngredients || isLoadingInstructions;
  const hasError = recipeError || ingredientsError || instructionsError;

  useEffect(() => {
    if (recipe) {
      refetchIngredients();
      refetchInstructions();
    }
  }, [recipe]);

  const renderContent = () => {
    if (isLoading) return <div>Loading...</div>;
    if (hasError) return <div>Error loading recipe. Please try again.</div>;

    return (
      <div>
        <div className={styles.editRecipeLink}>
          <Button
            variant="outlineRed"
            size="medium"
            destination="update"
            aria-label="Update current recipe"
          >
            Edit Recipe
          </Button>
        </div>
        <div className={styles.container}>
          <div className={styles.upperContainer}>
            <div className={styles.leftUpperContainer}>
              <div className={styles.titleContainer}>
                <h2>{recipe.title}</h2>
                <div>
                  {collection?.name && (
                    <>
                      <p>{collection.name}</p>
                      <div>|</div>
                    </>
                  )}
                  <p>{ingredients.length} Ingredients</p>
                </div>
              </div>
              <div className={styles.descriptionContainer}>
                <h3>Description</h3>
                <div className={styles.divider} />
                <p>{recipe.description}</p>
              </div>
            </div>
            <div className={styles.imgContainer}>
              <img src={recipe.image_url} alt={recipe.title} />
            </div>
          </div>
          <div className={styles.lowerContainer}>
            <div className={styles.ingredientsContainer}>
              <h3>Ingredients</h3>
              <div className={styles.divider} />
              <ul>
                {ingredients.map((item) => (
                  <li key={item.id}>
                    <label>{item.name}</label>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.instructionsContainer}>
              <h3>Instructions</h3>
              <div className={styles.divider} />
              <ul>
                {instructions.map((item) => (
                  <li key={item.id}>
                    <label>Step {item.step_number + 1}</label>
                    <p>{item.instruction_text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default CurrentRecipe;

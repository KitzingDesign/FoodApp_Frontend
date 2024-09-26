import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useGetOneRecipeQuery } from "../recipesApiSlice";
import { useGetIngredientsQuery } from "../../ingredients/ingredientsApiSlice";
import { useGetInstructionsQuery } from "../../instructions/instructionsApiSlice";

import styles from "./CurrentRecipe.module.css";
import { useEffect } from "react";

const CurrentRecipe = () => {
  const { recipeId } = useParams(); // Extract recipe ID from URL
  console.log(recipeId);

  const {
    data: recipe,
    error,
    isLoading: isLoadingRecipe,
  } = useGetOneRecipeQuery({ id: recipeId });

  // Fetch the ingredients for the specific recipex
  const {
    data: ingredient,
    error: ingredientsError,
    isLoading: isLoadingIngredients,
    refetch: refetchIngredients,
  } = useGetIngredientsQuery({ id: recipeId }); // Assuming the query accepts recipeId

  console.log(ingredient);

  // Fetch the instructions for the specific recipe
  const {
    data: instruction,
    error: instructionsError,
    isLoading: isLoadingInstructions,
    refetch: refetchInstructions,
  } = useGetInstructionsQuery({ id: recipeId }); // Assuming the query accepts recipeId
  console.log(instruction);

  console.log(recipe);

  useEffect(() => {
    if (recipe) {
      refetchIngredients();
      refetchInstructions();
    }
  }, [recipe]);

  const content =
    isLoadingRecipe || isLoadingIngredients || isLoadingInstructions ? (
      <div>Loading...</div>
    ) : error || ingredientsError || instructionsError ? (
      <div>Error loading recipe. Please try again.</div>
    ) : (
      <>
        <Link to="update" className={styles.editRecipeLink}>
          Edit Recipe
        </Link>
        <div className={styles.container}>
          <div className={styles.leftContainer}>
            <div className={styles.leftUpperContainer}>
              <div className={styles.titleContainer}>
                <h2>{recipe.title}</h2>
                <div>
                  <p>Collection</p>
                  <div>|</div>
                  <p>{ingredient.length} Ingredients</p>
                </div>
              </div>
              <div className={styles.descriptionContainer}>
                <h3>Description</h3>
                <div className={styles.divider} />
                <p>{recipe.description}</p>
              </div>
            </div>
            <div>
              <div className={styles.ingredientsContainer}>
                <h3>Ingredients</h3>
                <div className={styles.divider} />
                <ul>
                  {ingredient.map((item) => (
                    <li key={item.id}>
                      <label>{item.name}</label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.imgContainer}>
              <img src={recipe.image_url} alt={recipe.title} />
            </div>
            <div className={styles.instructionsContainer}>
              <h3>Instructions</h3>
              <div className={styles.divider} />
              <ul>
                {instruction.map((item) => (
                  <li key={item.id}>
                    <label>Step {item.step_number + 1}</label>
                    <p>{item.instruction_text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  return content;
};
export default CurrentRecipe;

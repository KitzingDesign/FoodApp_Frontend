import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectCurrentUserId } from "../../auth/authSlice";
import { useGetCollectionsQuery } from "../../collections/collectionsApiSlice";
import {
  useUpdateRecipeMutation,
  useGetOneRecipeQuery,
  useDeleteRecipeMutation,
} from "../recipesApiSlice";
import {
  useGetInstructionsQuery,
  useUpdateInstructionMutation,
} from "../../instructions/instructionsApiSlice";
import {
  useGetIngredientsQuery,
  useUpdateIngredientMutation,
} from "../../ingredients/ingredientsApiSlice";
import styles from "./UpdateRecipe.module.css";

const UpdateRecipe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recipeId } = useParams(); // Extract recipe ID from URL
  const userId = Number(useSelector(selectCurrentUserId));

  // API Get data
  const {
    data: recipe,
    error,
    isLoading,
    refetch: refetchRecipes,
  } = useGetOneRecipeQuery({ id: recipeId });
  const { data: instructions = [], isLoading: instructionLoading } =
    useGetInstructionsQuery({ id: recipeId });
  const { data: ingredients = [], isLoading: ingredientLoading } =
    useGetIngredientsQuery({ id: recipeId });

  // API Hooks
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();
  const [updateInstruction, { isLoading: isInstructionUpdating }] =
    useUpdateInstructionMutation();
  const [updateIngredient, { isLoading: isIngredientUpdating }] =
    useUpdateIngredientMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: ["", "", "", "", ""],
    instructions: ["", "", "", ""],
    image_url: "",
    user_id: userId,
    collection_id: "",
  });
  const [errMsg, setErrMsg] = useState("");

  // Fetch collections
  const { data: collections = [], isLoading: collectionsLoading } =
    useGetCollectionsQuery(userId);

  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          image_url: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (recipe) {
      setFormData((prevData) => ({
        ...prevData,
        title: recipe.title,
        description: recipe.description || "",
        ingredients: ingredients.map((ing) => ing.name) || Array(5).fill(""),
        instructions:
          instructions.map((ins) => ins.instruction_text) || Array(4).fill(""),
        image_url: recipe.image_url || "",
        collection_id: recipe.collection_id || "",
      }));
    }
  }, [recipe, ingredients, instructions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const index = e.target.dataset.index;

    if (name === "instructions") {
      const newInstructions = [...formData.instructions];
      newInstructions[index] = value;
      setFormData({
        ...formData,
        instructions: newInstructions,
      });
    } else if (name === "ingredients") {
      const newIngredients = [...formData.ingredients];
      newIngredients[index] = value;
      setFormData({
        ...formData,
        ingredients: newIngredients,
      });
    } else if (name === "collection_id") {
      setFormData({
        ...formData,
        collection_id: Number(value), // Convert string to number
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    if (!formData.title) {
      setErrMsg("Title is required");
      return;
    }

    try {
      // Update recipe
      const updatedRecipe = await updateRecipe({
        id: recipeId,
        ...formData,
      }).unwrap();

      // Update instructions
      for (let i = 0; i < formData.instructions.length; i++) {
        const instruction = formData.instructions[i];
        const instructionId = instructions[i]?.instruction_id || null; // Use the correct instruction_id
        console.log(instructionId, instruction);
        if (instruction) {
          console.log("Updating instruction");
          console.log(instructionId, instruction, i);
          await updateInstruction({
            instruction_id: instructionId, // Send the actual instruction_id
            instruction_text: instruction,
            step_number: i, // Ensure step number is correct
          }).unwrap();
          console.log("Instruction updated");
        }
      }

      // Update ingredients
      for (let i = 0; i < formData.ingredients.length; i++) {
        const ingredient = formData.ingredients[i];
        const ingredientId = ingredients[i]?.ingredient_id || null; // Use the correct ingredient_id

        if (ingredient) {
          console.log(ingredientId, ingredient);
          await updateIngredient({
            ingredient_id: ingredientId, // Send the actual ingredient_id
            name: ingredient,
          }).unwrap();
        }
      }

      navigate(`/welcome/${userId}/${recipeId}`);
    } catch (err) {
      setErrMsg("Failed to update recipe");
      console.error(err);
    }
  };

  const addInstructionField = () => {
    setFormData((prevData) => ({
      ...prevData,
      instructions: [...prevData.instructions, ""],
    }));
  };

  const addIngredientField = () => {
    setFormData((prevData) => ({
      ...prevData,
      ingredients: [...prevData.ingredients, ""],
    }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteRecipe({ id: recipeId });
      refetchRecipes();
      navigate(`/welcome/${userId}`);
    } catch (err) {
      setErrMsg("Failed to delete recipe");
      console.error(err);
    }
  };

  return (
    <>
      {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
      <button
        type="submit"
        className={styles.deleteButton}
        onClick={handleDelete}
      >
        <p>Delete Recipe</p>
      </button>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.upperContainer}>
          <div className={styles.upperLeftContainer}>
            <div className={styles.selectCollection}>
              <label htmlFor="collection_id"> Collection</label>
              <select
                name="collection_id"
                value={formData.collection_id}
                className={styles.collectionId}
                onChange={handleInputChange}
              >
                <option value=""></option>
                {collections.map((collection) => (
                  <option
                    key={collection.collection_id}
                    value={collection.collection_id}
                  >
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputTitle}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.inputDescription}>
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          <div
            className={styles.imgContainer}
            onClick={() => fileInputRef.current.click()}
          >
            {formData.image_url ? (
              <img
                className={styles.img}
                src={formData.image_url}
                alt={formData.title}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <div className={styles.placeholder}>Click to upload an image</div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }} // Hide the file input
            />
          </div>
        </div>

        <div className={styles.lowerContainerIngredients}>
          <label>Ingredient and amount</label>
          <div className={styles.ingredientsContainer}>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className={styles.ingredientContainer}>
                <label>{index + 1}</label>
                <input
                  type="text"
                  name="ingredients"
                  data-index={index}
                  value={ingredient}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={addIngredientField}>
            <p>Add Ingredient</p>
          </button>
        </div>

        <div className={styles.lowerContainerInstructions}>
          <label>Instructions</label>
          <div className={styles.instructionContainer}>
            {formData.instructions.map((instruction, index) => (
              <div key={index}>
                <label>{index + 1}</label>
                <textarea
                  type="text"
                  name="instructions"
                  data-index={index}
                  value={instruction}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className={styles.addInstructionButton}
            onClick={addInstructionField}
          >
            <p>Add Instruction</p>
          </button>
        </div>

        <button type="submit" className={styles.submitButton}>
          <p>Submit Changes</p>
        </button>
      </form>
    </>
  );
};

export default UpdateRecipe;

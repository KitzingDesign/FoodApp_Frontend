import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import heic2any from "heic2any";

import { selectCurrentUserId } from "../../auth/authSlice";
import { setActiveTitle } from "../../../components/dashboard/dashboardSlice";
import { useGetCollectionsQuery } from "../../collections/collectionsApiSlice";
import {
  useUpdateRecipeMutation,
  useGetOneRecipeQuery,
  useDeleteRecipeMutation,
} from "../recipesApiSlice";
import {
  useGetInstructionsQuery,
  useUpdateInstructionMutation,
  useAddNewInstructionMutation,
} from "../../instructions/instructionsApiSlice";
import {
  useGetIngredientsQuery,
  useUpdateIngredientMutation,
  useAddNewIngredientMutation,
} from "../../ingredients/ingredientsApiSlice";

// Components and styles
import styles from "./EditRecipeContent.module.css";
import ImportImageIcon from "../../../../public/image.jsx";
import CloseIcon from "/public/close.jsx";
import Button from "../../../UI/Button.jsx";

// Helper function to get initial state
const getInitialFormData = (userId, collectionId) => ({
  title: "",
  description: "",
  ingredients: Array(5).fill(""),
  instructions: Array(4).fill(""),
  image_url: "",
  user_id: userId,
  collection_id: collectionId ? Number(collectionId) : "",
});

const EditRecipeContent = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recipeId } = useParams(); // Extract recipe ID from URL
  const userId = Number(useSelector(selectCurrentUserId));

  const [imageFile, setImageFile] = useState(null); // State for the image file

  // API Get data
  const {
    data: recipe,
    error,
    isLoading,
    refetch: refetchRecipes,
  } = useGetOneRecipeQuery({ id: recipeId });

  const {
    data: instructions = [],
    isLoading: instructionLoading,
    refetch: refetchInstructions,
  } = useGetInstructionsQuery({ id: recipeId });

  const {
    data: ingredients = [],
    isLoading: ingredientLoading,
    refetch: refetchIngredients,
  } = useGetIngredientsQuery({ id: recipeId });

  // API Hooks
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();
  const [updateInstruction, { isLoading: isInstructionUpdating }] =
    useUpdateInstructionMutation();
  const [updateIngredient, { isLoading: isIngredientUpdating }] =
    useUpdateIngredientMutation();
  const [addNewInstruction, { isLoading: isAddingInstruction }] =
    useAddNewInstructionMutation();
  const [addNewIngredient, { isLoading: isAddingIngredient }] =
    useAddNewIngredientMutation();

  const [formData, setFormData] = useState(getInitialFormData(userId));
  const [errMsg, setErrMsg] = useState("");

  // Fetch collections
  const { data: collections = [], isLoading: collectionsLoading } =
    useGetCollectionsQuery(userId);

  const fileInputRef = useRef(null); // Create a ref for the file input

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

    if (name === "instructions" || name === "ingredients") {
      const newList = [...formData[name]];
      newList[index] = value;
      setFormData({
        ...formData,
        [name]: newList,
      });
    } else if (name === "collection_id") {
      // Explicitly convert collection_id to a number
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file is HEIC and convert it to JPG for preview
      if (file.type === "image/heic" || file.type === "image/heif") {
        try {
          // Convert HEIC to JPEG using heic2any
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg", // Convert to JPEG for preview
          });

          const convertedFile = new File(
            [convertedBlob],
            file.name.replace(/\.[^/.]+$/, ".jpg"),
            {
              type: "image/jpeg",
            }
          );

          // Set the converted file for preview and upload
          setImageFile(convertedFile);
          setFormData((prevData) => ({
            ...prevData,
            image_url: URL.createObjectURL(convertedFile), // Set preview to the converted image
          }));
        } catch (error) {
          console.error("Error converting HEIC to JPEG:", error);
        }
      } else {
        // For non-HEIC images, just use the file directly
        setImageFile(file);
        setFormData((prevData) => ({
          ...prevData,
          image_url: URL.createObjectURL(file),
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    if (!formData.title) {
      setErrMsg("Title is required");
      return;
    }

    const recipeFormData = new FormData();
    recipeFormData.append("title", formData.title);
    recipeFormData.append("description", formData.description || "");
    recipeFormData.append("user_id", userId);
    recipeFormData.append("collection_id", formData.collection_id || "");
    recipeFormData.append("recipe_id", recipeId);
    recipeFormData.append("image_url", formData.image_url);

    


    // Append the image if available
    if (imageFile) {
      recipeFormData.append("image", imageFile);
    }

    try {
      // Update recipe
      const updatedRecipe = await updateRecipe({ recipeFormData }).unwrap();

      // Update instructions
      for (let i = 0; i < formData.instructions.length; i++) {
        const instruction = formData.instructions[i];
        const instructionId = instructions[i]?.instruction_id || null; // Use the correct instruction_id
        if (instruction && instructionId) {
          await updateInstruction({
            instruction_id: instructionId,
            instruction_text: instruction,
            step_number: i,
          }).unwrap();
        } else if (!instructionId) {
          await addNewInstruction({
            recipe_id: Number(recipeId),
            instruction_text: instruction,
            step_number: i,
          }).unwrap();
        }
      }

      // Update ingredients
      for (let i = 0; i < formData.ingredients.length; i++) {
        const ingredient = formData.ingredients[i];
        const ingredientId = ingredients[i]?.ingredient_id || null; // Use the correct ingredient_id

        if (ingredient && ingredientId) {
          await updateIngredient({
            ingredient_id: ingredientId,
            name: ingredient,
          }).unwrap();
        } else if (!ingredientId) {
          await addNewIngredient({
            recipe_id: Number(recipeId),
            name: ingredient,
          }).unwrap();
        }
      }

      // Refetch updated data
      refetchIngredients();
      refetchInstructions();
      refetchRecipes();

      onClose();
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
      dispatch(setActiveTitle({ activeTitle: "All Recipes" }));
      navigate(`/welcome/${userId}`);
    } catch (err) {
      setErrMsg("Failed to delete recipe");
      console.error(err);
    }
  };

  return (
    <>
      {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
      <div className={styles.deleteButtonContainer}>
        <Button size="medium" variant="fillRed" onClick={handleDelete}>
          Delete Recipe
        </Button>
      </div>
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
              accept="image/*,image/heic,image/heif"
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
          <button type="button" onClick={addInstructionField}>
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

export default EditRecipeContent;

// External imports
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import heic2any from "heic2any";

import { useNavigate, useParams } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import PulseLoader from "react-spinners/PulseLoader";

// Api and redux imports
import { selectCurrentUserId } from "../../auth/authSlice.jsx";
import {
  useAddNewRecipeMutation,
  useGetRecipeFromUrlQuery,
} from "../recipesApiSlice";
import { useAddNewInstructionMutation } from "../../instructions/instructionsApiSlice.jsx";
import { useAddNewIngredientMutation } from "../../ingredients/ingredientsApiSlice.jsx";
import { useGetCollectionsQuery } from "../../collections/collectionsApiSlice.jsx";

// Components and styles
import styles from "./AddRecipeContent.module.css";
import ImportImageIcon from "../../../../public/image.jsx";
import ErrorMsg from "../../../UI/errorMsg/ErrorMsg.jsx";

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

const AddRecipeContent = ({ isOpen, onClose }) => {
  const { collectionId } = useParams();
  const userId = Number(useSelector(selectCurrentUserId));

  const [recipeUrl, setRecipeUrl] = useState("");
  const [urlToFetch, setUrlToFetch] = useState("");
  const [formData, setFormData] = useState(
    getInitialFormData(userId, collectionId)
  );
  const [imageFile, setImageFile] = useState(null); // State for the image file
  const [errMsg, setErrMsg] = useState("");

  // Fetch collections
  const { data: collections = [], isLoading: collectionsLoading } =
    useGetCollectionsQuery(userId);

  const [addRecipe, { isLoading: isAdding }] = useAddNewRecipeMutation();
  const [addInstruction] = useAddNewInstructionMutation();
  const [addIngredient] = useAddNewIngredientMutation();

  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Create a ref for the file input

  const {
    data: recipe,
    error: urlError,
    isLoading: isUrlLoading,
  } = useGetRecipeFromUrlQuery(urlToFetch, { skip: !urlToFetch });

  useEffect(() => {
    if (recipe) {
      setFormData((prevData) => ({
        ...prevData,
        title: recipe.name,
        description: recipe.description || "",
        ingredients: recipe.recipeIngredient || Array(5).fill({ text: "" }),
        instructions: Array.isArray(recipe.recipeInstructions)
          ? recipe.recipeInstructions.map((instruction) => instruction.text)
          : Array(4).fill(""),
        image_url: recipe.image || "",
      }));
    }
    if (urlError) {
      setErrMsg("Failed to fetch recipe from the provided URL.");
    }
  }, [recipe, urlError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const index = e.target.dataset.index;

    if (name === "instructions" || name === "ingredients") {
      const newList = [...formData[name]];
      newList[index] = value;
      setFormData({ ...formData, [name]: newList });
    } else if (name === "collection_id") {
      setFormData({ ...formData, collection_id: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUrlChange = (e) => {
    setRecipeUrl(e.target.value);
  };

  const handleSubmitUrl = (e) => {
    e.preventDefault();
    setErrMsg(""); // Clear any previous errors

    if (!recipeUrl) {
      setErrMsg("Please enter a valid URL.");
      return;
    }

    try {
      setUrlToFetch(recipeUrl);
    } catch (error) {
      setErrMsg("Failed to extract recipe from the provided URL.");
      console.error("Error fetching recipe from URL:", error);
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
    recipeFormData.append("description", formData.description);
    recipeFormData.append("user_id", userId);
    recipeFormData.append("collection_id", formData.collection_id);
    recipeFormData.append("image_url", formData.image_url);

    if (imageFile) {
      recipeFormData.append("image", imageFile);
    }

    try {
      const newRecipe = await addRecipe({ recipeFormData }).unwrap();

      const areAllInstructionsEmpty = formData.instructions.every(
        (instruction) => instruction.trim() === ""
      );

      if (areAllInstructionsEmpty) {
        addInstruction({
          recipe_id: newRecipe.recipe_id,
          instruction_text: "No instruction provided",
          step_number: 0,
        }).unwrap();
      } else {
        formData.instructions
          .filter((instruction) => instruction.trim() !== "")
          .forEach((instruction, index) => {
            addInstruction({
              recipe_id: newRecipe.recipe_id,
              instruction_text: instruction,
              step_number: index,
            }).unwrap();
          });
      }

      const areAllIngredientsEmpty = formData.ingredients.every(
        (ingredient) => ingredient.trim() === ""
      );

      if (areAllIngredientsEmpty) {
        addIngredient({
          recipe_id: newRecipe.recipe_id,
          name: "No ingredient provided",
        }).unwrap();
      } else {
        formData.ingredients
          .filter((ingredient) => ingredient.trim() !== "")
          .forEach((ingredient, index) => {
            addIngredient({
              recipe_id: newRecipe.recipe_id,
              name: ingredient,
            }).unwrap();
          });
      }

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

  const resetForm = () => {
    setFormData(getInitialFormData(userId, collectionId));
    setRecipeUrl("");
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

  return (
    <>
      <form onSubmit={handleSubmitUrl} className={styles.urlContainer}>
        <label htmlFor="url" className={styles.urlTitle}>
          Add Recipe from URL
          <img
            src="/info.svg"
            alt="info icon"
            data-tooltip-id="my-tooltip-1"
            aria-describedby="my-tooltip-1"
          />
        </label>
        <ReactTooltip
          id="my-tooltip-1"
          place="right"
          content={
            <p>
              Extracting recipes only works from some websites.
              <br />
              If it doesn't, you can manually add the recipe.
            </p>
          }
        />
        <div>
          <input
            type="url"
            name="url"
            id="url"
            value={recipeUrl}
            onChange={handleUrlChange}
            required
            aria-required="true"
          />
          <button className={styles.urlButton} type="submit">
            Extract Recipe
          </button>
        </div>
        {isUrlLoading && isAdding && (
          <div className={styles.loader}>
            <PulseLoader color="#4156a1" />
          </div>
        )}
        {errMsg && <ErrorMsg role="alert" errMsg={errMsg} />}
      </form>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.upperContainer}>
          <div className={styles.upperLeftContainer}>
            <div className={styles.selectCollection}>
              <label htmlFor="collection_id">Select Collection</label>
              <select
                name="collection_id"
                id="collection_id"
                value={formData.collection_id}
                className={styles.collectionId}
                onChange={handleInputChange}
                aria-label="Select Collection"
              >
                <option value="">None</option>
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
                aria-required="true"
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

          <button
            type="button"
            className={styles.imgContainer}
            onClick={() => fileInputRef.current.click()}
            aria-label="Upload Image"
          >
            {formData.image_url ? (
              <img
                src={formData.image_url}
                alt={formData.title || "Recipe Image"}
              />
            ) : (
              <div className={styles.placeholder}>
                <ImportImageIcon alt="Upload Image Here" />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,image/heic,image/heif"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </button>
        </div>

        <div className={styles.lowerContainerIngredients}>
          <label htmlFor="ingredients">Ingredients and Amount</label>
          <div className={styles.ingredientsContainer}>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className={styles.ingredientContainer}>
                <label htmlFor={`ingredient-${index}`}>{index + 1}</label>
                <input
                  type="text"
                  name="ingredients"
                  id={`ingredient-${index}`}
                  data-index={index}
                  value={ingredient}
                  onChange={handleInputChange}
                  aria-label={`Ingredient ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={addIngredientField}>
            <p>Add Ingredient</p>
          </button>
        </div>

        <div className={styles.lowerContainerInstructions}>
          <label htmlFor="instructions">Instructions</label>
          <div className={styles.instructionContainer}>
            {formData.instructions.map((instruction, index) => (
              <div key={index}>
                <label htmlFor={`instruction-${index}`}>{index + 1}</label>
                <textarea
                  id={`instruction-${index}`}
                  name="instructions"
                  data-index={index}
                  value={instruction}
                  onChange={handleInputChange}
                  aria-label={`Instruction ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={addInstructionField}>
            <p>Add Instruction</p>
          </button>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isAdding}
        >
          {isAdding ? <p>Adding...</p> : <p>Add Recipe</p>}
        </button>
      </form>
    </>
  );
};

export default AddRecipeContent;

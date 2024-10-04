import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";

import ImportImageIcon from "../../../../public/image.jsx";

import { selectCurrentUserId } from "../../auth/authSlice";
import {
  useAddNewRecipeMutation,
  useGetRecipeFromUrlQuery,
  useUploadImageMutation,
} from "../recipesApiSlice";
import { useAddNewInstructionMutation } from "../../instructions/instructionsApiSlice";
import { useAddNewIngredientMutation } from "../../ingredients/ingredientsApiSlice";
import { useGetCollectionsQuery } from "../../collections/collectionsApiSlice"; // Import the collections query hook

import styles from "./AddRecipe.module.css";

function AddRecipe() {
  const { collectionId } = useParams(); // Extract recipe ID from URL
  const userId = Number(useSelector(selectCurrentUserId));

  const [recipeUrl, setRecipeUrl] = useState("");
  const [urlToFetch, setUrlToFetch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: ["", "", "", "", ""],
    instructions: ["", "", "", ""],
    image_url: "",
    user_id: userId,
    collection_id: collectionId ? Number(collectionId) : "",
  });

  const [imageFile, setImageFile] = useState(null); // State for the image file
  const [errMsg, setErrMsg] = useState("");

  // Fetch collections
  const { data: collections = [], isLoading: collectionsLoading } =
    useGetCollectionsQuery(userId);

  //Api hooks
  const [addRecipe, { isLoading: isAdding }] = useAddNewRecipeMutation();
  const [addInstruction] = useAddNewInstructionMutation();
  const [addIngredient] = useAddNewIngredientMutation();

  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Create a ref for the file input

  const {
    data: recipe,
    error,
    isLoading: isUrlLoading,
  } = useGetRecipeFromUrlQuery(urlToFetch, {
    skip: !urlToFetch,
  });

  useEffect(() => {
    if (recipe) {
      console.log(recipe);
      setFormData((prevData) => ({
        ...prevData,
        title: recipe.name,
        description: recipe.description || "",
        ingredients: recipe.recipeIngredient || Array(5).fill({ text: "" }),
        instructions: Array.isArray(recipe.recipeInstructions)
          ? recipe.recipeInstructions.map((instruction) => instruction.text) // Extracting text
          : Array(4).fill(""), // Default to empty instructions
        image_url: recipe.image || "",
      }));
    }
  }, [recipe]);

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

  const handleUrlChange = (e) => {
    setRecipeUrl(e.target.value);
  };

  const handleSubmitUrl = (e) => {
    e.preventDefault();
    setUrlToFetch(recipeUrl);
  };

  // Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the file in state for later upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          image_url: reader.result, // For preview purposes only
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file); // Use the appropriate field name expected by your backend

    try {
      const response = await fetch("/api/upload", {
        // Replace with your actual endpoint
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Image upload failed");

      const data = await response.json();
      return data.imageUrl; // Adjust based on your server's response structure
    } catch (error) {
      console.error(error);
      return null; // Return null on failure
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

    // Append the image if available
    if (imageFile) {
      recipeFormData.append("image", imageFile);
    }
    console.log("recipeFormData", recipeFormData);

    // Include the image_url in the form data
    // const newRecipeData = {
    //   ...formData,
    //   image_url: imageUrl || formData.image_url, // Use the new image URL if uploaded
    // };

    try {
      // Debugging: iterate over the FormData to check the entries
      for (let [key, value] of recipeFormData.entries()) {
        console.log(`${key}:`, value);
      }

      const newRecipe = await addRecipe(recipeFormData).unwrap();
      console.log(newRecipe);
      console.log("recipe id", newRecipe.recipe_id);
      // Now, add the instructions
      let index = 0;
      for (let instruction of formData.instructions) {
        if (instruction) {
          // Ensure the instruction is not empty
          await addInstruction({
            recipe_id: Number(newRecipe.recipe_id),
            instruction_text: instruction,
            step_number: index,
          }).unwrap();
          index++;
        }
      }
      for (let ingredient of formData.ingredients) {
        if (ingredient) {
          // Ensure the instruction is not empty
          await addIngredient({
            recipe_id: Number(newRecipe.recipe_id),
            name: ingredient,
          }).unwrap();
        }
      }
      setFormData({
        title: "",
        description: "",
        instructions: Array(5).fill(""),
        ingredients: Array(5).fill(""),
        image_url: "",
        user_id: userId,
        collection_id: "",
      });
      setRecipeUrl("");

      // Invalidate the recipe cache so the updated list can be refetched
      // dispatch(apiSlice.util.invalidateTags(["Recipe"]));
      navigate(`/welcome/${userId}`);
    } catch (err) {
      setErrMsg("Failed to add recipe");
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

  return (
    <>
      {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
      <form onSubmit={handleSubmitUrl} className={styles.urlContainer}>
        <label htmlFor="url">Add Recipe from url</label>
        <div>
          <input
            type="text"
            name="url"
            id="url"
            value={recipeUrl}
            onChange={handleUrlChange}
            required
          />
          <button type="submit">knapp</button>
        </div>
      </form>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.upperContainer}>
          <div className={styles.upperLeftContainer}>
            <div className={styles.selectCollection}>
              <label htmlFor="collection_id">Select Collection</label>
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
              <div className={styles.placeholder}>
                <ImportImageIcon />
              </div>
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
            {formData.ingredients &&
              formData.ingredients.map((ingredient, index) => (
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
          <p>Add Recipe</p>
        </button>
      </form>
    </>
  );
}

export default AddRecipe;

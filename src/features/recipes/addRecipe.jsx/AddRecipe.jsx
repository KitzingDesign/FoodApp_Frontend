import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import ImportImageIcon from "../../../../public/image.jsx";

import { selectCurrentUserId } from "../../auth/authSlice";
import {
  useAddNewRecipeMutation,
  useGetRecipeFromUrlQuery,
} from "../recipesApiSlice";
import { useAddNewInstructionMutation } from "../../instructions/instructionsApiSlice";
import { useAddNewIngredientMutation } from "../../ingredients/ingredientsApiSlice";
import { useGetCollectionsQuery } from "../../collections/collectionsApiSlice"; // Import the collections query hook

import styles from "./AddRecipe.module.css";

function AddRecipe() {
  const dispatch = useDispatch();

  const { collectionId, recipeId } = useParams(); // Extract recipe ID from URL

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
  const [errMsg, setErrMsg] = useState("");
  // Fetch collections
  const { data: collections = [], isLoading: collectionsLoading } =
    useGetCollectionsQuery(userId);

  //Api hooks
  const [addRecipe, { isLoading }] = useAddNewRecipeMutation();
  const [addInstruction] = useAddNewInstructionMutation();
  const [addIngredient] = useAddNewIngredientMutation();

  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    if (!formData.title) {
      setErrMsg("Title is required");
      return;
    }

    try {
      console.log(formData);
      const newRecipe = await addRecipe({ ...formData }).unwrap();
      console.log(newRecipe);
      console.log(newRecipe.recipe);
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
                    className={styles.ingredientInput}
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

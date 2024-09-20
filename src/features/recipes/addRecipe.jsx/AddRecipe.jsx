import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../auth/authSlice";

import {
  useAddNewRecipeMutation,
  useGetRecipeFromUrlQuery,
} from "../recipesApiSlice";

function AddRecipe() {
  const userId = Number(useSelector(selectCurrentUserId));
  console.log(userId);
  // State to store form inputs
  const [recipeUrl, setRecipeUrl] = useState("");
  const [urlToFetch, setUrlToFetch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: [],
    image_url: "",
    user_id: Number(userId),
  });

  const [addRecipe, { isLoading }] = useAddNewRecipeMutation();

  //Fetch recipe data based on the URL
  const {
    data: recipe,
    error,
    isLoading: isUrlLoading,
  } = useGetRecipeFromUrlQuery(urlToFetch, {
    skip: !urlToFetch, // Skip the query if recipeUrl is empty
  });
  console.log(recipe);

  useEffect(() => {
    if (recipe) {
      setFormData({
        ...formData,
        title: recipe.name,
        description: recipe.description,
      });
    }
  }, [recipe]);

  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUrlChange = (e) => {
    setRecipeUrl(e.target.value);
  };

  // Handle URL input
  const handleSubmitUrl = async (e) => {
    e.preventDefault();
    setUrlToFetch(recipeUrl); // Set the recipe URL to trigger the query
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg(""); // Clear previous errors

    // Simple validation
    if (!formData.title) {
      setErrMsg("Title is required");
      return;
    }

    try {
      // Make POST request to the backend
      const userData = await addRecipe({
        ...formData,
      }).unwrap();
      setFormData({
        title: "",
        description: "",
        instructions: [],
        image_url: "",
        user_id: "",
      }); // Clear form
    } catch (err) {
      setErrMsg("Failed to add recipe");
      console.error(err);
    }
  };

  return (
    <div className="add-recipe">
      <h2>Add New Recipe</h2>

      {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
      <form onSubmit={handleSubmitUrl}>
        <div>
          <label htmlFor="url">Url:</label>
          <input
            type="text"
            name="url"
            id="url"
            value={recipeUrl}
            onChange={handleUrlChange}
            required
          />
        </div>
        <button type="submit">Prase Url</button>
      </form>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div>
          <label htmlFor="instructions">Instructions:</label>
          <textarea
            name="instructions"
            id="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div>
          <label htmlFor="image_url">Image URL:</label>
          <input
            type="text"
            name="image_url"
            id="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
}

export default AddRecipe;

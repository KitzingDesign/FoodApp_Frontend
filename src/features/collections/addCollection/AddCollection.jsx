import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUserId } from "../../auth/authSlice";
import { useAddNewCollectionMutation } from "../collectionsApiSlice";
import styles from "./AddCollection.module.css";

const AddCollection = () => {
  const dispatch = useDispatch();
  const userId = Number(useSelector(selectCurrentUserId));
  const [errMsg, setErrMsg] = useState(""); // State for error message
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    user_id: userId,
  });

  // Get the mutation function from the hook
  const [addNewCollection, { isLoading }] = useAddNewCollectionMutation();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Add validation or data processing logic here
    if (!formData.name) {
      setErrMsg("Name is required.");
      return;
    }

    // Api connection
    try {
      const newCollection = await addNewCollection(formData).unwrap(); // Call the mutation function
      console.log(newCollection.collection);
      console.log("New collection created: ", newCollection);

      // Reset form after submission
      setFormData({ name: "", description: "", user_id: userId });
      setErrMsg(""); // Clear any error message
    } catch (error) {
      setErrMsg(error.message || "Failed to create collection."); // Set error message if the mutation fails
      console.error("Failed to create collection: ", error);
    }
  };

  return (
    <>
      {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
      <form onSubmit={handleSubmit} className={styles.urlContainer}>
        <div className={styles.upperContainer}>
          <div className={styles.inputContainer}>
            <div className={styles.inputTitle}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
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
        </div>
        <button className={styles.button} type="submit">
          Add Collection
        </button>
      </form>
    </>
  );
};

export default AddCollection;

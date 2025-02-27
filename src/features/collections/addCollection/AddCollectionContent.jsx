import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../auth/authSlice";
import { useAddNewCollectionMutation } from "../collectionsApiSlice";

// Modal.jsx
import styles from "./AddCollectionContent.module.css";

const AddCollectionContent = ({ isOpen, onClose }) => {
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
      console.log("New collection created: ", newCollection);

      // Reset form after submission
      setFormData({ name: "", description: "", user_id: userId });
      setErrMsg(""); // Clear any error message
      onClose(); // Close the modal
    } catch (error) {
      setErrMsg(error.message || "Failed to create collection."); // Set error message if the mutation fails
      console.error("Failed to create collection: ", error);
    }
  };

  // Close modal if the overlay is clicked
  const handleOverlayClick = (event) => {
    if (event.target.classList.contains(styles.overlay)) {
      onClose(); // Call the onClose function passed as a prop
    }
  };

  // Add event listener for 'Escape' key to close modal and submit form
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "Enter") {
        handleSubmit(event); // Manually trigger form submit
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, formData]);

  return (
    <div>
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
        <button className={styles.submitButton} type="submit">
          <p>Add Collection</p>
        </button>
      </form>
    </div>
  );
};

export default AddCollectionContent;

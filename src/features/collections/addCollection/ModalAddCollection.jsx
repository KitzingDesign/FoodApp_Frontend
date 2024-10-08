import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import FocusTrap from "focus-trap-react";
import { selectCurrentUserId } from "../../auth/authSlice";
import { useAddNewCollectionMutation } from "../collectionsApiSlice";
import CloseIcon from "/public/close.jsx";

// Modal.jsx
import styles from "./ModalAddCollection.module.css";

const ModalAddCollection = ({ isOpen, onClose }) => {
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

  // Close modal if the overlay is clicked
  const handleOverlayClick = (event) => {
    if (event.target.classList.contains(styles.overlay)) {
      onClose(); // Call the onClose function passed as a prop
    }
  };

  // Add event listener for 'Escape' key to close modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add the event listener when the modal opens
    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the modal closes or component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <FocusTrap>
          <div>
            <div className={styles.titleContainer}>
              <h2>Add new Recipe</h2>
              <button onClick={onClose}>
                <CloseIcon />
              </button>
            </div>
            <div className={styles.divider} />
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
          </div>
        </FocusTrap>
      </div>
    </div>
  );
};

export default ModalAddCollection;

// ConfirmDeleteModal.js
import React, { useEffect } from "react";
import FocusTrap from "focus-trap-react";
import styles from "./ConfirmDeleteModal.module.css";
import Button from "../../UI/Button";
import CloseIcon from "/public/close.jsx"; // Ensure correct path to your CloseIcon component

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  // Close modal if the overlay is clicked
  const handleOverlayClick = (event) => {
    if (event.target.classList.contains(styles.overlay)) {
      onClose();
    }
  };

  // Add event listener for 'Escape' key to close modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener when the modal closes or component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <FocusTrap>
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
          <div>
            <div className={styles.titleContainer}>
              <h2>Are you sure?</h2>
              <button onClick={onClose}>
                <CloseIcon />
              </button>
            </div>

            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className={styles.buttonContainer}>
              <Button size="medium" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onConfirm} size="medium" variant="fillRed">
                Yes, Delete My Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};

export default ConfirmDeleteModal;

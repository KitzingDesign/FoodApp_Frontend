// External imports
import { useEffect } from "react";
import FocusTrap from "focus-trap-react";

// Components and styles
import styles from "./Modal.module.css";
import CloseIcon from "/public/close.jsx";

const Modal = ({ isOpen, onClose, title, children }) => {
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
    <FocusTrap>
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
          <div>
            <div className={styles.titleContainer}>
              <h2>{title}</h2>
              <button onClick={onClose}>
                <CloseIcon />
              </button>
            </div>
            <div className={styles.divider} />
            {children}
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};

export default Modal;

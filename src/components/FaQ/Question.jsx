import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Question.module.css"; // Assuming you have a CSS module for styling

const Question = ({ title, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAnswer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className={styles.question}>
      {/* Question Header */}
      <div className={styles.questionHeader} onClick={toggleAnswer}>
        <h3>{title}</h3>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <img src="./chevron.svg" />
        </motion.div>
      </div>

      {/* Animate Answer Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} // Set a high maxHeight value
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{ overflow: "hidden" }} // Ensures content doesn't overflow while animating
          >
            <p className={styles.answer}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Question;

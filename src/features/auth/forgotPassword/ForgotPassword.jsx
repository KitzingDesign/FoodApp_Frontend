// src/components/ForgotPassword.js
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import Button from "../../../UI/Button";
import LogoIcon from "../../../../public/logo";
import { auth } from "../../../config/firebase"; // Adjust the import path if needed
import styles from "./ForgotPassword.module.css"; // Ensure this CSS file exists

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className={styles.outerContainer}>
      <Link to="/" className={styles.logo}>
        <LogoIcon />
      </Link>
      <div className={styles.container}>
        {!message ? (
          <>
            <h1>Forgot Password</h1>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
              <div className={styles.buttonContainer}>
                <Button
                  variant="fill"
                  size="medium"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Send Reset Email
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className={styles.successContainer}>
            <h1 className={styles.successMessage}>{message}</h1>
            <Button
              variant="fill"
              size="medium"
              type="login"
              destination="/login"
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ForgotPassword;

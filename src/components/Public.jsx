import styles from "./Public.module.css";
import Button from "../UI/Button";
import LogoIcon from "../../public/logo";

import { Link, Navigate } from "react-router-dom";

export const Public = () => {
  return (
    <div className={styles["home-view"]}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <div>
            <LogoIcon />
          </div>
          <p className={styles.logo}>MatMatMat</p>
        </div>
        <div className={styles.textContainer}>
          <p className={styles.header}>
            Collect all your recipes
            <br />
            at one place
          </p>
          <p className={styles.description}>
            <span className={styles.span}>
              Tired of losing track of your favorite recipes? With{" "}
            </span>
            <span className={styles["text-wrapper-2"]}>MatMatMat</span>
            <span className={styles.span}>
              , you can easily collect, organize, and access all your go-to
              dishes in one convenient place.{" "}
            </span>
          </p>
        </div>
        <div className={styles.ellipse} />
        <div className={styles.buttonContainer}>
          <Link to="/login">
            <div className={styles.loginButton}>Login</div>
          </Link>
          <Link to="/register">
            <button className={styles.signupButton}>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Public;

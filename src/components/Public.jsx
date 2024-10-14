import { useState, useEffect } from "react";
import styles from "./Public.module.css";
import Button from "../UI/Button";
import LogoIcon from "../../public/logo";
import { motion } from "framer-motion";

import { Link, Navigate } from "react-router-dom";

export const Public = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 480;
      setIsMobile(isNowMobile);
      setShowSidebar(!isNowMobile); // Show sidebar if desktop, hide if mobile
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const windowWidth = window.innerWidth;

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <div>
          <LogoIcon />
        </div>
        <p className={styles.logo}>MatMatMaten.</p>
      </div>
      <section className={styles.heroContainer}>
        <div className={styles.hero}>
          <div className={styles.titleContainer}>
            <div className={styles.textContainer}>
              <h1>Collect All Your Recipes at One Place</h1>
              <p className={styles.description}>
                Tired of losing track of your favorite recipes? With
                <span> MatMatMaten.</span>, you can easily collect, organize,
                and access all your go-to dishes in one convenient place.
              </p>
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
          <div className={styles.heroImgContainer}>
            <img src="/heroImg.png" />
            <motion.div
              className={styles.bubble}
              initial={{
                translateX: !isMobile ? "-70%" : "-50%", // Starting point on X axis
                translateY: !isMobile ? "-35%" : "-40%", // Starting point on Y axis
              }}
              animate={{
                scale: [1, 1.05, 1], // Scaling effect
              }}
              transition={{
                duration: 3, // 5 seconds duration
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "loop", // Specifies that it should loop
                repeatDelay: 0, // 2 seconds delay between each loop
              }}
            />
          </div>
        </div>
      </section>
      <section className={styles.recipeSection}>
        <div>
          <img src="/recipeImg.png" />
        </div>
      </section>
      <section className={styles.stepsContainer}>
        <h2>3 Easy Steps </h2>
        <div className={styles.stepsLayout}>
          <div className={styles.step}>
            <div className={styles.stepImgBlue}>
              <img src="/createIcon.svg" alt="create icon" />
            </div>
            <h3>Create</h3>
            <p>
              Create and save your favorite recipes in your own culinary library
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepImgRed}>
              <img src="/organizeIcon.svg" />
            </div>
            <h3>Organize</h3>
            <p>
              Organize you recipes into collection, keeping it clean and easy to
              access
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepImgBlue}>
              <img src="/customizeIcon.svg" />
            </div>
            <h3>Customize</h3>
            <p>
              Customize your recipes as you go. Maybe 3 garlic cloves wasn’t
              enough?
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Public;

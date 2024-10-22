import { useState, useEffect } from "react";
import styles from "./Public.module.css";
import Button from "../UI/Button";
import LogoIcon from "../../public/logo";
import { motion } from "framer-motion";

import { Link, Navigate } from "react-router-dom";
import FAQ from "./FaQ/FaQ";
import Footer from "./footer/Footer";

const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
};

export const Public = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [preloadedImages, setPreloadedImages] = useState({
    heroImg: "",
    recipeImg: "",
    createImg: "",
    editImg: "",
  });

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

  // Preload images for faster loading
  useEffect(() => {
    const images = [
      "/heroImg.png",
      "/recipeImg.png",
      "/addRecipeImg.png",
      "/editImg.png",
    ];

    const loadedImages = {};

    images.forEach((src, index) => {
      preloadImage(src); // Preload the image
      if (index === 0) loadedImages.heroImg = src; // Store hero image path
      if (index === 1) loadedImages.recipeImg = src; // Store recipe image path
      if (index === 2) loadedImages.createImg = src;
      if (index === 3) loadedImages.editImg = src;
    });

    setPreloadedImages(loadedImages); // Set preloaded images to state
  }, []);

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
            <img src={preloadedImages.heroImg} />
            <div className={styles.bubble} />
          </div>
        </div>
      </section>
      <section className={styles.recipeSection}>
        <div>
          <img
            src={preloadedImages.recipeImg}
            alt="Image of recipe displayed in matmatmats dashboard"
          />
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
      <div className={styles.instructionSections}>
        <section className={styles.leftSection}>
          <img
            src={preloadedImages.createImg}
            alt="Create Recipe"
            className={styles.sectionImg}
          />
          <div className={styles.sectionTextContainer}>
            <h2>Create</h2>
            <p>
              Welcome to your personal online cookbook! Here, you have the
              flexibility to build your recipe collection exactly the way you
              want. Whether you’ve found a great recipe online or have a family
              favorite that’s been passed down for generations, we make it easy
              for you to store, organize, and customize it. You can quickly
              import a recipe by simply pasting a URL or add it manually.
            </p>
          </div>
        </section>
        <section className={styles.rightSection}>
          <div className={styles.balls}>
            <img src="/redBall.svg" />
            <img src="/blueBall.svg" />
          </div>
          <img
            src={preloadedImages.recipeImg}
            alt="Edit Recipe Dashboard"
            className={styles.sectionImg}
          />
          <div className={styles.sectionTextContainer}>
            <h2>Organize</h2>
            <p>
              Here, you have the power to organize your recipe collection in a
              way that suits your culinary style. Whether you want to categorize
              your dishes by cuisine, meal type, or special occasions, our
              intuitive system makes it simple. Create custom collections to
              keep your favorite recipes together, making it easy to find what
              you need when you need it.
            </p>
          </div>
        </section>
        <section className={styles.leftSection}>
          <img
            src={preloadedImages.editImg}
            alt="Create Recipe"
            className={styles.sectionImg}
          />
          <div className={styles.sectionTextContainer}>
            <h2>Customize</h2>
            <p>
              Customize your recipes! In matmatmaten. you have the power to
              tailor your recipes to suit your unique tastes and preferences.
              Whether you’ve tried a recipe and realized it could use a little
              extra garlic or discovered that a pinch of spice elevates your
              dish, we encourage you to make it your own. Easily edit
              ingredients, adjust measurements, or modify instructions to
              reflect your culinary discoveries.
            </p>
          </div>
        </section>
      </div>
      <section className={styles.faq}>
        <h2>Frequently Asked Questions</h2>
        <FAQ />
      </section>
      <Footer />
    </div>
  );
};

export default Public;

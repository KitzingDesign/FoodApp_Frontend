import classes from "./Public.module.css";
import Button from "../UI/Button";
import { Link, Navigate } from "react-router-dom";

export const Public = () => {
  return (
    <div className={classes["home-view"]}>
      <div className={classes.container}>
        <div className={classes.logoContainer}>
          <span></span>
          <p className={classes.logo}>MatMatMat</p>
        </div>
        <div className={classes.textContainer}>
          <p className={classes.header}>
            Collect all your recipes
            <br />
            at one place
          </p>
          <p className={classes.description}>
            <span className={classes.span}>
              Tired of losing track of your favorite recipes? With{" "}
            </span>
            <span className={classes["text-wrapper-2"]}>MatMatMat</span>
            <span className={classes.span}>
              , you can easily collect, organize, and access all your go-to
              dishes in one convenient place.{" "}
            </span>
          </p>
        </div>
        <div className={classes.ellipse} />
        <div className={classes.buttonContainer}>
          <Link to="/login">
            <Button size="large" variant="fill">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button size="large" variant="outline">
              Signup
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Public;

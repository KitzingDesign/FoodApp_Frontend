import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LogoIcon from "../../../public/logo";

import styles from "./PageNotFound.module.css";
import Button from "../../UI/Button";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.logoContainer}>
        <LogoIcon />
      </Link>
      <div className={styles.textContainer}>
        <h1>Huston, We Have a Problem</h1>
        <h2>404</h2>
        <p>Page Not Found</p>
        <Button onClick={() => navigate(-1)} variant="fill" size="large">
          Go Back
        </Button>
      </div>
      <div className={styles.imgContainer}>
        <img src="/404Img.png" />
      </div>
    </div>
  );
};

export default PageNotFound;

import { Link } from "react-router-dom";
import styles from "./Footer.module.css"; // Make sure to create a corresponding CSS file for styling

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.divider} />
      <div className={styles.footerContent}>
        <p>/</p>
        <p>MatMatMaten</p>
        <ul>
          <Link to="/">All Recipes</Link>
          <Link to="/">Profile Page</Link>
          <Link to="/about">FaQ (soon to come)</Link>
          <Link to="/contact">Legal</Link>
        </ul>
        <p>///////////////////</p>
        <p>
          &copy; {new Date().getFullYear()} Cook Book App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

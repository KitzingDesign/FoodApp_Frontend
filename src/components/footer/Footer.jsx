import { Link } from "react-router-dom";
import styles from "./Footer.module.css"; // Make sure to create a corresponding CSS file for styling

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.divider} />
      <div className={styles.footerContent}>
        <div className={styles.brandContainer}>
          <p className={styles.brandSymbol}>/</p>
          <p className={styles.brandName}>MatMatMaten</p>
        </div>
        <nav>
          <ul className={styles.linksList}>
            <li>
              <Link to="/">All Recipes</Link>
            </li>
            <li>
              <Link to="/">Profile Page</Link>
            </li>
            <li>
              <Link to="/about">FAQ (soon to come)</Link>
            </li>
            <li>
              <Link to="/contact">Legal</Link>
            </li>
          </ul>
        </nav>
        <p className={styles.separator}>///////////////////</p>
        <p className={styles.copyRight}>
          &copy; {new Date().getFullYear()} MatMatMaten. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

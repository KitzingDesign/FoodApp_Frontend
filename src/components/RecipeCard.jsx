import styles from "./RecipeCard.module.css";
import { Link } from "react-router-dom";
const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/18/${recipe.recipe_id}`} className={styles.cardContainer}>
      <div className={styles.imgContainer}></div>
      <div className={styles.textContainer}>
        <h3 className={styles.title}>{recipe.title}</h3>
        <p className={styles.description}>{recipe.description}</p>
      </div>
    </Link>
  );
};

export default RecipeCard;

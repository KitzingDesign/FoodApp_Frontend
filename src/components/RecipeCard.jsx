import styles from "./RecipeCard.module.css";
import { Link } from "react-router-dom";
import { setActiveTitle } from "./dashboard/dashboardSlice";
import { useSelector, useDispatch } from "react-redux";

const RecipeCard = ({ recipe }) => {
  const dispatch = useDispatch();
  return (
    <Link
      to={`/welcome/${recipe.user_id}/${recipe.recipe_id}`}
      className={styles.cardContainer}
      onClick={() => {
        dispatch(setActiveTitle({ activeTitle: "" }));
      }}
    >
      <div className={styles.imgContainer}>
        {recipe.image_url ? (
          <img className={styles.foodImg} src={recipe.image_url} />
        ) : (
          <img className={styles.placeholderImg} src="/grocery-bag.png" />
        )}
      </div>
      <div className={styles.textContainer}>
        <h3>{recipe.title}</h3>
      </div>
    </Link>
  );
};

export default RecipeCard;

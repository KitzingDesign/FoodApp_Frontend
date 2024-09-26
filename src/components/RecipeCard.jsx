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
        <img src={recipe.image_url} />
      </div>
      <div className={styles.textContainer}>
        <h3>{recipe.title}</h3>
      </div>
    </Link>
  );
};

export default RecipeCard;

import styles from "./RecipeCard.module.css";
import { Link } from "react-router-dom";
import { setActiveTitle } from "./dashboard/dashboardSlice";
import { useGetOneCollectionQuery } from "../features/collections/collectionsApiSlice";
import { useDispatch } from "react-redux";

const RecipeCard = ({ recipe }) => {
  const {
    data: collection,
    error,
    isLoading,
  } = useGetOneCollectionQuery(
    { id: recipe.collection_id },
    { skip: !recipe.collection_id }
  );

  console.log(collection);

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
        {collection ? (
          <div className={styles.collectionTab}>
            <p>{collection.name}</p>
          </div>
        ) : null}
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

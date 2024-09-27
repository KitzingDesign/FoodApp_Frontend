import { Link } from "react-router-dom";
import { useGetCollectionRecipesQuery } from "../../features/collections/collectionsApiSlice";
import styles from "./CollectionCard.module.css";

const CollectionCard = ({ collection }) => {
  const {
    data: collectionRecipes = [],
    isLoading,
    isError,
  } = useGetCollectionRecipesQuery(collection.collection_id);

  console.log(collection);

  return (
    <Link to={`${collection.collection_id}`} className={styles.container}>
      <h3>{collection.name}</h3>
      <div className={styles.divider} />
      {collectionRecipes.length > 0 ? (
        <p>
          <b>{collectionRecipes.length}</b> recipes
        </p>
      ) : (
        <p>No recipes yet</p>
      )}
    </Link>
  );
};
export default CollectionCard;

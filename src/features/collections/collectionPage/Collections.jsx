import { useGetCollectionsQuery } from "../collectionsApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../auth/authSlice";
import { Link } from "react-router-dom";
import CollectionCard from "../../../components/collectionCard/CollectionCard";
import styles from "./Collections.module.css";
import Button from "../../../UI/Button";

const Collections = () => {
  const userId = Number(useSelector(selectCurrentUserId));
  console.log(userId);
  const {
    data: collections = [],
    error,
    isLoading,
  } = useGetCollectionsQuery(userId);

  console.log(collections);

  const content = isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <div className={styles.addCollectionLink}>
        <Button
          variant="outline"
          size="medium"
          destination="add"
          aria-label="Add a recipe to a collection"
        >
          Add Collection
        </Button>
      </div>
      <div className={styles.collectionContainer}>
        {collections.map((collection) => (
          <CollectionCard
            key={collection.collection_id}
            collection={collection}
            className={styles.collectionCard}
          />
        ))}
      </div>
    </>
  );

  return content;
};

export default Collections;

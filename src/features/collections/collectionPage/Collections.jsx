import { useGetCollectionsQuery } from "../collectionsApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../auth/authSlice";
import { Link } from "react-router-dom";
import CollectionCard from "../../../components/collectionCard/CollectionCard";
import styles from "./Collections.module.css";

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
      <Link to="add" className={styles.addCollectionLink}>
        Add Collection
      </Link>
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

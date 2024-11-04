import { Link } from "react-router-dom";
import { useGetCollectionRecipesQuery } from "../../features/collections/collectionsApiSlice";
import { setActiveTab } from "../../components/Sidebar/sidebarSlice";
import { setActiveTitle } from "../../components/dashboard/dashboardSlice";
import { useDispatch } from "react-redux";
import styles from "./CollectionCard.module.css";

const CollectionCard = ({ collection }) => {
  const dispatch = useDispatch();

  const {
    data: collectionRecipes = [],
    isLoading,
    isError,
  } = useGetCollectionRecipesQuery(collection.collection_id);

  //helper function to handle active link
  const handleActiveLink = ({ activeTab, activeTitle }) => {
    dispatch(setActiveTab({ activeTab }));
    dispatch(setActiveTitle({ activeTitle }));
  };

  return (
    <Link
      to={`${collection.collection_id}`}
      onClick={() =>
        handleActiveLink({
          activeTitle: collection.name,
          activeTab: collection.collection_id,
        })
      }
      className={styles.container}
    >
      <div className={styles.content}>
        <h3>{collection.name}</h3>
        <div className={styles.divider} />
        {collectionRecipes.length > 0 ? (
          <p>
            <b>{collectionRecipes.length}</b> recipes
          </p>
        ) : (
          <p>No recipes yet</p>
        )}
      </div>
    </Link>
  );
};

export default CollectionCard;

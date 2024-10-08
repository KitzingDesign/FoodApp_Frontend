import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Styles
import styles from "./CollectionList.module.css";

// Icons
import EditIcon from "../../../public/edit.jsx";

// Other inputs
import { selectCurrentUserId } from "../auth/authSlice";
import { useGetCollectionsQuery } from "./collectionsApiSlice";
import {
  selectCurrentActiveTab,
  setActiveTab,
} from "../../components/Sidebar/sidebarSlice";
import { setActiveTitle } from "../../components/dashboard/dashboardSlice";

const CollectionList = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectCurrentActiveTab);
  const userId = Number(useSelector(selectCurrentUserId));

  const {
    data: collections = [],
    error,
    isLoading,
  } = useGetCollectionsQuery(userId);

  // Handler to update active tab and title
  const handleClickedLink = (activeTab, activeTitle) => {
    dispatch(setActiveTab({ activeTab }));
    dispatch(setActiveTitle({ activeTitle }));
  };

  // Component for a single collection item
  const CollectionItem = ({ collection }) => (
    <li
      key={collection.collection_id}
      className={`${styles.menuTab} ${
        Number(activeTab) === collection.collection_id ? styles.active : ""
      }`}
    >
      <Link
        to={`collections/${collection.collection_id}`}
        onClick={() =>
          handleClickedLink(collection.collection_id, collection.name)
        }
        className={styles.Link}
      >
        <p>{collection.name}</p>
      </Link>
      <Link
        to={`collections/${collection.collection_id}/edit`}
        onClick={() =>
          handleClickedLink(collection.collection_id, "Edit Collection")
        }
        className={styles.editLink}
      >
        <EditIcon />
      </Link>
    </li>
  );

  // Main content rendering
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!collections.length) return <div>No collections found</div>;

  return (
    <ul className={styles.container}>
      {collections.map((collection) => (
        <CollectionItem
          key={collection.collection_id}
          collection={collection}
        />
      ))}
    </ul>
  );
};

export default CollectionList;

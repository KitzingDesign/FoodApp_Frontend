import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Styles
import styles from "./CollectionList.module.css";

// Icons
import EditIcon from "../../../public/edit.jsx";

// Other inputs
import { selectCurrentUserId } from "../auth/authSlice";
import {
  useGetCollectionsQuery,
  useGetCollectionRecipesQuery,
} from "./collectionsApiSlice";
import {
  selectCurrentActiveTab,
  setActiveTab,
} from "../../components/Sidebar/sidebarSlice";
import { setActiveTitle } from "../../components/dashboard/dashboardSlice";
import Modal from "../../components/Modal/Modal";
import EditCollectionContent from "./editCollection/EditCollectionContent";

const CollectionList = ({ isMobile, toggleSidebar }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectCurrentActiveTab);
  const userId = Number(useSelector(selectCurrentUserId));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const {
    data: collections = [],
    error,
    isLoading,
  } = useGetCollectionsQuery(userId);

  // Handler to update active tab and title
  const handleClickedLink = (activeTab, activeTitle) => {
    dispatch(setActiveTab({ activeTab }));
    dispatch(setActiveTitle({ activeTitle }));
    isMobile && toggleSidebar();
  };

  // Handler to collection calculation
  const handleCounter = (collection_id) => {
    const {
      data: collectionRecipes = [],
      isLoading: isLoadingRecipes,
      isError,
      refetch: refetchRecipes,
    } = useGetCollectionRecipesQuery(collection_id);
    return <p className={styles.recipeCount}> {collectionRecipes.length} </p>;
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
      {handleCounter(collection.collection_id)}
      <button
        onClick={() => openModal({ collection_id: collection.collection_id })}
        className={styles.editLink}
      >
        <EditIcon />
      </button>
    </li>
  );

  // Main content rendering
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul className={styles.container}>
      {collections && collections.length > 0 ? (
        collections.map((collection) => (
          <CollectionItem
            key={collection.collection_id}
            collection={collection}
          />
        ))
      ) : (
        <li className={styles.noTab}>You have no Collections</li>
      )}
      <Modal isOpen={isModalOpen} title="Add Collection" onClose={closeModal}>
        <EditCollectionContent onClose={closeModal} />
      </Modal>
    </ul>
  );
};

export default CollectionList;

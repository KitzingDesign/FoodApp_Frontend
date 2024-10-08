import { useGetCollectionsQuery } from "../collectionsApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../auth/authSlice";
import { useState } from "react";
import CollectionCard from "../../../components/collectionCard/CollectionCard";
import styles from "./Collections.module.css";
import Button from "../../../UI/Button";
import ModalAddCollection from "../addCollection/ModalAddCollection";

const Collections = () => {
  const userId = Number(useSelector(selectCurrentUserId));
  console.log(userId);
  const {
    data: collections = [],
    error,
    isLoading,
  } = useGetCollectionsQuery(userId);

  // Modal state to handle open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle modal open/close
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const content = isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <div className={styles.addCollectionLink}>
        <Button
          variant="outline"
          size="medium"
          onClick={openModal}
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
      {/* Modal for adding a new recipe */}
      <ModalAddCollection isOpen={isModalOpen} onClose={closeModal} />
    </>
  );

  return content;
};

export default Collections;

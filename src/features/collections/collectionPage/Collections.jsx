import { useGetCollectionsQuery } from "../collectionsApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../auth/authSlice";
import { useState } from "react";

// Import Modal and other components
import AddCollectionContent from "../addCollection/AddCollectionContent";
import Modal from "../../../components/Modal/Modal";
import CollectionCard from "../../../components/collectionCard/CollectionCard";
import Button from "../../../UI/Button";
import styles from "./Collections.module.css";

const Collections = () => {
  const userId = Number(useSelector(selectCurrentUserId));
  const { data: collections = [], isLoading } = useGetCollectionsQuery(userId);
  const [isModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.addCollectionLink}>
        <Button
          variant="outline"
          size="medium"
          onClick={openEditModal}
          aria-label="Add a collection"
        >
          Add Collection
        </Button>
      </div>
      {collections.length ? (
        <div className={styles.collectionContainer}>
          {collections.map((collection) => (
            <CollectionCard
              key={collection.collection_id}
              collection={collection}
              className={styles.collectionCard}
            />
          ))}
        </div>
      ) : (
        <div className={styles.placeholderContainer}>
          <img
            src="/collection-placeholder.png"
            alt="Image of a bee hive with bees collecting honey"
          />
          <h3>No Collections Yet...</h3>
          <p>
            Your culinary adventure awaits! Start your first collection and
            watch your cookbook grow!
          </p>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        title="Add Collection"
        onClose={closeEditModal}
      >
        <AddCollectionContent onClose={closeEditModal} />
      </Modal>
    </div>
  );
};

export default Collections;

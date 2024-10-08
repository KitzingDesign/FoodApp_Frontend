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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.addCollectionLink}>
        <Button
          variant="outline"
          size="medium"
          onClick={toggleModal}
          aria-label="Add a collection"
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
      <Modal isOpen={isModalOpen} title="Add Collection" onClose={toggleModal}>
        <AddCollectionContent onClose={toggleModal} />
      </Modal>
    </div>
  );
};

export default Collections;

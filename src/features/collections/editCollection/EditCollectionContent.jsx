// External imports
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// Api imports
import {
  useGetOneCollectionQuery,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} from "../collectionsApiSlice";
import { setActiveTitle } from "../../../components/dashboard/dashboardSlice";

// Components and styles
import styles from "./EditCollectionContent.module.css";
import Button from "../../../UI/Button";

const EditCollectionContent = ({ isOpen, onClose, children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { collectionId } = useParams();
  const [errMsg, setErrMsg] = useState("");

  // API Get data
  const {
    data: collection,
    error,
    isLoading,
    refetch: refetchCollection,
  } = useGetOneCollectionQuery({ id: collectionId });
  const [updateCollection, { isLoading: isUpdating }] =
    useUpdateCollectionMutation();
  const [deleteCollection, { isLoading: isDeleting }] =
    useDeleteCollectionMutation();

  console.log("refetching collections!!!", collection);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name || "",
        description: collection.description || "",
      });
    }
  }, [collection]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    if (!formData.name) {
      setErrMsg("Name is required");
      return;
    }

    try {
      await updateCollection({
        id: collectionId,
        ...formData,
      }).unwrap();

      dispatch(setActiveTitle({ activeTitle: formData.name }));

      // Optionally refetch to ensure latest data is in the cache
      await refetchCollection();

      navigate(`/welcome/collections/${collectionId}`);
    } catch (err) {
      setErrMsg("Failed to update collection");
      console.error(err);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteCollection({ id: Number(collectionId) });
      dispatch(setActiveTitle({ activeTitle: "Collections" }));
      navigate(`/welcome/collections`);
    } catch (err) {
      setErrMsg("Failed to delete recipe");
      console.error(err);
    }
  };

  return (
    <>
      {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
      <div className={styles.deleteButtonContainer}>
        <Button size="medium" variant="fillRed" onClick={handleDelete}>
          Delete Container
        </Button>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputContainer}>
          <div className={styles.inputTitle}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.inputDescription}>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button
          className={styles.submitButton}
          type="submit"
          disabled={isUpdating || isLoading}
        >
          <p>{isUpdating ? "Updating..." : "Update Collection"}</p>
        </button>
      </form>
    </>
  );
};

export default EditCollectionContent;

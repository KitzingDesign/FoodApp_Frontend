import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditCollection.module.css";
import {
  useGetOneCollectionQuery,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} from "../collectionsApiSlice";

const EditCollection = () => {
  const navigate = useNavigate();
  const { collectionId } = useParams();
  const [errMsg, setErrMsg] = useState("");

  // API Get data
  const {
    data: collection,
    error,
    isLoading,
  } = useGetOneCollectionQuery({ id: collectionId });
  const [updateCollection, { isLoading: isUpdating }] =
    useUpdateCollectionMutation();
  const [deleteCollection, { isLoading: isDeleting }] =
    useDeleteCollectionMutation();

  console.log(collection);

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
      navigate(`/welcome/collections`);
    } catch (err) {
      setErrMsg("Failed to delete recipe");
      console.error(err);
    }
  };

  return (
    <>
      {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}
      <button
        type="submit"
        className={styles.deleteButton}
        onClick={handleDelete}
      >
        <p>Delete Recipe</p>
      </button>
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
          className={styles.button}
          type="submit"
          disabled={isUpdating || isLoading}
        >
          {isUpdating ? "Updating..." : "Update Collection"}
        </button>
      </form>
    </>
  );
};

export default EditCollection;

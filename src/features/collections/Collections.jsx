import { useGetCollectionsQuery } from "./collectionsApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../auth/authSlice";
import { Link } from "react-router-dom";

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
      <Link to="add">Add Collection</Link>
      <ul>
        {collections.map((collection) => (
          <li key={collection.collection_id}>{collection.name}</li>
        ))}
      </ul>
    </>
  );

  return content;
};

export default Collections;

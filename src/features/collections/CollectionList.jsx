import { useGetCollectionsQuery } from "./collectionsApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../auth/authSlice";

const CollectionList = () => {
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
    <ul>
      {collections.map((collection) => (
        <li key={collection.collection_id}>{collection.name}</li>
      ))}
    </ul>
  );

  return content;
};

export default CollectionList;

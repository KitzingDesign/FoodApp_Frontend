import { selectCurrentUserId } from "../auth/authSlice";
import { selectCurrentCollection } from "./collectionSlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTitle } from "../../components/dashboard/dashboardSlice";
import styles from "./CollectionList.module.css";
import { useGetCollectionsQuery } from "./collectionsApiSlice";

import {
  selectCurrentActiveTab,
  setActiveTab,
} from "../../components/Sidebar/sidebarSlice";

const CollectionList = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectCurrentActiveTab);

  const userId = Number(useSelector(selectCurrentUserId));

  const {
    data: collections = [],
    error,
    isLoading,
  } = useGetCollectionsQuery(userId);

  console.log(collections);

  const handleClickedLink = ({ activeTab, activeTitle }) => {
    dispatch(setActiveTab({ activeTab }));
    dispatch(setActiveTitle({ activeTitle }));
  };

  const content = isLoading ? (
    <div>Loading...</div>
  ) : (
    <ul>
      {collections.map((collection) => (
        <li key={collection.collection_id}>
          <Link
            className={`${styles.menuTab} ${
              Number(activeTab) === collection.collection_id
                ? styles.active
                : ""
            }`}
            to={`collections/${collection.collection_id}`}
            onClick={() =>
              handleClickedLink({
                activeTab: collection.collection_id,
                activeTitle: collection.name,
              })
            }
            key={collection.collection_id}
          >
            <p>{collection.name}</p>
          </Link>
        </li>
      ))}
    </ul>
  );

  return content;
};

export default CollectionList;
import { selectCurrentUserId } from "../auth/authSlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTitle } from "../../components/dashboard/dashboardSlice";
import styles from "./CollectionList.module.css";
import EditIcon from "../../../public/edit.jsx";

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
    refetch: refetchCollections,
  } = useGetCollectionsQuery(userId);

  const handleClickedLink = ({ activeTab, activeTitle }) => {
    dispatch(setActiveTab({ activeTab }));
    dispatch(setActiveTitle({ activeTitle }));
  };

  const content = isLoading ? (
    <div>Loading...</div>
  ) : (
    <ul className={styles.container}>
      {collections.map((collection) => (
        <li
          key={collection.collection_id}
          className={`${styles.menuTab} ${
            Number(activeTab) === collection.collection_id ? styles.active : ""
          }`}
        >
          <Link
            to={`collections/${collection.collection_id}`}
            onClick={() =>
              handleClickedLink({
                activeTab: collection.collection_id,
                activeTitle: collection.name,
              })
            }
            className={styles.Link}
          >
            <p>{collection.name}</p>
          </Link>
          <Link
            to={`collections/${collection.collection_id}/edit`}
            onClick={() =>
              handleClickedLink({
                activeTab: collection.collection_id,
                activeTitle: "Edit Collection",
              })
            }
            className={styles.editLink}
          >
            <EditIcon />
          </Link>
        </li>
      ))}
    </ul>
  );

  return content;
};

export default CollectionList;

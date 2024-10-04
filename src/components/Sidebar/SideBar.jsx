import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import styles from "./SideBar.module.css";
import ProfileIcon from "../../../public/profile";
import ChevronIcon from "../../../public/chevron";
import PlusIcon from "../../../public/plus";
import RecipeBookIcon from "../../../public/recipeBook";
import RecipeBookIconOpen from "../../../public/recipeBookOpen";
import CollectionList from "../../features/collections/CollectionList";
import { useGetUserQuery } from "../../features/users/usersApiSlice";
import { useSelector, useDispatch } from "react-redux";

import { selectCurrentActiveTab, setActiveTab } from "./sidebarSlice";
import { setActiveTitle } from "../dashboard/dashboardSlice";

function SideBar({ userId }) {
  const dispatch = useDispatch();

  const activeTab = useSelector(selectCurrentActiveTab);
  console.log("activeTab", activeTab);

  const [isExpanded, setIsExpanded] = useState(false);

  const { data: user, error, isLoading } = useGetUserQuery(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user found</div>;

  const handleActiveLink = ({ activeTab, activeTitle }) => {
    dispatch(setActiveTab({ activeTab }));
    dispatch(setActiveTitle({ activeTitle }));
  };

  return (
    <div className={styles.sidebar}>
      <Link to={"profile"} className={styles.titleContainer}>
        <div className={styles.profileContainer}>
          <ProfileIcon />
        </div>
        {/* // change to real name */}
        <h2 className={styles.sidebarTitle}>
          {user.first_name} {user.last_name}
        </h2>
      </Link>
      <ul className={styles.listContainer}>
        <li className={activeTab === "ALL_RECIPES" ? styles.active : ""}>
          <Link
            to={`${userId}`}
            onClick={() => {
              handleActiveLink({
                activeTab: "ALL_RECIPES",
                activeTitle: "All Recipes",
              });
            }}
          >
            <RecipeBookIcon
              color={activeTab === "ALL_RECIPES" ? "#bf310c" : "#333"}
            />
            <p>All your Recipes</p>
          </Link>
        </li>
        <li className={activeTab === "COLLECTION" ? styles.active : ""}>
          <Link
            to="collections"
            onClick={() => {
              handleActiveLink({
                activeTab: "COLLECTION",
                activeTitle: "Collections",
              });
            }}
          >
            <RecipeBookIconOpen
              color={activeTab === "COLLECTION" ? "#bf310c" : "#333"}
            />
            <p>Collections</p>
          </Link>
          <div className={styles.flexIcons}>
            <Link to="collections/add">
              <PlusIcon />
            </Link>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 90 }}
              onClick={() => setIsExpanded(() => !isExpanded)}
            >
              <ChevronIcon className={styles.chevron} />
            </motion.div>
          </div>
        </li>
      </ul>
      {isExpanded && <CollectionList />}
    </div>
  );
}

export default SideBar;

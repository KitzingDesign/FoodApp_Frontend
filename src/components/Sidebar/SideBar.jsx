import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//Styles
import styles from "./SideBar.module.css";

//Icons
import ProfileIcon from "../../../public/profile";
import ChevronIcon from "../../../public/chevron";
import PlusIcon from "../../../public/plus";
import RecipeBookIcon from "../../../public/recipeBook";
import RecipeBookIconOpen from "../../../public/recipeBookOpen";

import CollectionList from "../../features/collections/CollectionList";
import { useGetUserQuery } from "../../features/users/usersApiSlice";
import { selectCurrentActiveTab, setActiveTab } from "./sidebarSlice";
import { setActiveTitle } from "../dashboard/dashboardSlice";

function SideBar({ userId }) {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectCurrentActiveTab);
  const [isExpanded, setIsExpanded] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 480;
      setIsMobile(isNowMobile);
      setShowSidebar(!isNowMobile); // Show sidebar if desktop, hide if mobile
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: user, error, isLoading } = useGetUserQuery(userId);

  // Loading, error, and no user found states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user found</div>;

  //helper function to handle active link
  const handleActiveLink = ({ activeTab, activeTitle }) => {
    dispatch(setActiveTab({ activeTab }));
    dispatch(setActiveTitle({ activeTitle }));
  };

  // Functional Component for User Profile Section
  const UserProfile = () => (
    <Link to={"profile"} className={styles.titleContainer}>
      <div className={styles.profileContainer}>
        <ProfileIcon />
      </div>
      <h2 className={styles.sidebarTitle}>
        {user.first_name} {user.last_name}
      </h2>
    </Link>
  );

  // Functional Component for Sidebar Items
  const SidebarItem = ({ link, icon: Icon, tab, label }) => (
    <li className={activeTab === tab ? styles.active : ""}>
      <Link
        to={link}
        onClick={() => handleActiveLink({ activeTab: tab, activeTitle: label })}
      >
        <Icon color={activeTab === tab ? "#bf310c" : "#333"} />
        <p>{label}</p>
      </Link>
    </li>
  );

  return (
    <div className={styles.sidebar}>
      <UserProfile />
      <ul className={styles.listContainer}>
        <SidebarItem
          link={`${userId}`}
          icon={RecipeBookIcon}
          tab="ALL_RECIPES"
          label="All Recipes"
        />
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
              <button>
                <ChevronIcon className={styles.chevron} />
              </button>
            </motion.div>
          </div>
        </li>
      </ul>
      {isExpanded && <CollectionList />}
    </div>
  );
}

export default SideBar;

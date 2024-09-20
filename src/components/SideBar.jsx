import { useState } from "react";
import { motion } from "framer-motion";

import styles from "./SideBar.module.css";
import ProfileIcon from "../../public/profile";
import ChevronIcon from "../../public/chevron";
import PlusIcon from "../../public/plus";
import RecipeBookIcon from "../../public/recipeBook";
import RecipeBookIconOpen from "../../public/recipeBookOpen";
import CollectionList from "../features/collections/CollectionList";
import { useGetUserQuery } from "../features/users/usersApiSlice";

function SideBar({ userId }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: user, error, isLoading } = useGetUserQuery(userId);

  console.log(user);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user found</div>;

  console.log(user);

  return (
    <div className={styles.sidebar}>
      <div className={styles.titleContainer}>
        <div className={styles.profileContainer}>
          <ProfileIcon />
        </div>
        {/* // change to real name */}
        <h2 className={styles.sidebarTitle}>
          {user.first_name} {user.last_name}
        </h2>
      </div>

      <ul className={styles.allRecipes}>
        <RecipeBookIcon />
        <li className={styles.allRecipesButton}>All your Recipes</li>
      </ul>
      <ul className={styles.collectionListContainer}>
        <div className={styles.flexIcons}>
          <RecipeBookIconOpen />
          <li className={styles.allRecipesButton}>Collections</li>
        </div>
        <div className={styles.flexIcons}>
          <PlusIcon />
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 90 }}
            onClick={() => setIsExpanded(() => !isExpanded)}
          >
            <ChevronIcon className={styles.chevron} />
          </motion.div>
        </div>
      </ul>
      {isExpanded && <CollectionList />}
    </div>
  );
}

export default SideBar;

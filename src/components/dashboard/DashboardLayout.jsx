import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import styles from "./DashboardLayout.module.css";
import SideBar from "../Sidebar/SideBar";
import SidebarOpenCloseIcon from "../../../public/sidebarOpenClose";

import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUserId } from "../../features/auth/authSlice";

import { selectIsExpanded, setIsExpanded } from "../Sidebar/sidebarSlice";
import { selectCurrentActiveTitle } from "./dashboardSlice";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const isExpanded = useSelector(selectIsExpanded);
  const title = useSelector(selectCurrentActiveTitle);

  // Local state to track when the animation completes
  const [animationComplete, setAnimationComplete] = useState(false);

  const userId = useSelector(selectCurrentUserId);

  const handleTitleText = (title) => {
    setIsTitleText(title);
  };

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.aside
            className={styles.sidebar}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
          >
            <SideBar
              userId={userId}
              handleTitleChange={(title) => handleTitleText(title)}
            />
          </motion.aside>
        )}
      </AnimatePresence>
      <main className={styles.containerMain}>
        <motion.div
          animate={{ x: isExpanded ? -60 : 8 }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
          // className={styles.visibleIcon}
          onClick={() => dispatch(setIsExpanded())}
          onAnimation={() => setAnimationComplete(false)}
          onAnimationComplete={() => setAnimationComplete(true)}
          style={{
            position: isExpanded ? "fixed" : "absolute",
            top: "38px", // Fixed top position
            //left: "260px", // Fixed left position
            zIndex: 1000, // Keep it on top of other elements
            cursor: "pointer", // Ensure the cursor changes on hover
          }}
          layout="position"
        >
          <SidebarOpenCloseIcon />
        </motion.div>
        {!(title === "") ? <h2 className={styles.title}>{title}</h2> : null}
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: isExpanded ? 0 : 56 }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
          className={styles.spanLink}
        >
          {!(title === "") ? `/ ${title}` : "/ Current Recipe"}
        </motion.span>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

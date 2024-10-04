import { Link, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

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

  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  // Local state to track when the animation completes
  const [animationComplete, setAnimationComplete] = useState(false);

  const userId = useSelector(selectCurrentUserId);

  // Effect to handle screen resizing and determine if it’s mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
      if (window.innerWidth > 767) {
        setShowSidebar(true); // Show sidebar if resizing to larger screen
      } else {
        setShowSidebar(false); // Hide sidebar on small screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const handleTitleText = (title) => {
    setIsTitleText(title);
  };

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {showSidebar && (
          <motion.aside
            className={styles.sidebar}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isMobile ? "100%" : 300, opacity: 1 }}
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
          animate={{ x: showSidebar ? -60 : 8 }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
          // className={styles.visibleIcon}
          onClick={() => {
            if (isMobile) {
              toggleSidebar();
            } else setShowSidebar(() => !showSidebar);
          }}
          onAnimation={() => setAnimationComplete(false)}
          onAnimationComplete={() => setAnimationComplete(true)}
          style={{
            position: showSidebar ? "fixed" : "absolute",
            top: "16px", // Fixed top position
            //left: "260px", // Fixed left position
            zIndex: 1000, // Keep it on top of other elements
            cursor: "pointer", // Ensure the cursor changes on hover
          }}
          layout="position"
        >
          <SidebarOpenCloseIcon />
        </motion.div>
        {isMobile && showSidebar ? null : (
          <>
            {!(title === "") ? (
              <div>
                <h2 className={styles.title}>{title}</h2>
              </div>
            ) : null}
            <motion.span
              initial={{ x: 0 }}
              animate={{ x: showSidebar ? 0 : 48 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
              className={styles.spanLink}
            >
              {!(title === "") ? `/ ${title}` : "/ Current Recipe"}
            </motion.span>
            <Outlet />
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;

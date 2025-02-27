import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// Styles
import styles from "../dashboard/DashboardLayout.module.css";

// Components and Icons
import SideBar from "../../components/Sidebar/Sidebar.jsx";
import SidebarOpenCloseIcon from "../../../public/sidebarOpenClose";

// Redux Selectors
import { selectCurrentUserId } from "../../features/auth/authSlice.jsx";
import { selectCurrentActiveTitle } from "./dashboardSlice.jsx";
import Footer from "../footer/Footer.jsx";

const DashboardLayout = () => {
  const userId = useSelector(selectCurrentUserId);
  const title = useSelector(selectCurrentActiveTitle);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 480;
      setIsMobile(isNowMobile);
      setShowSidebar(!isNowMobile); // Show sidebar if desktop, hide if mobile
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  const windowWidth = window.innerWidth;

  return (
    <div className={`${styles.container} full-height-element`}>
      <motion.div
        onClick={toggleSidebar}
        initial={{ x: 8 }}
        animate={{
          x: showSidebar ? (isMobile ? windowWidth - 50 : 250) : 16,
        }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
        style={{
          position: "absolute",

          top: "16px",
          zIndex: 1000,
          cursor: "pointer",
          willChange: "transform",
        }}
        onAnimationComplete={() => console.log("Animation complete")}
        layout="position"
      >
        <div className={styles.toggleContainer}>
          <SidebarOpenCloseIcon />
        </div>
      </motion.div>
      <AnimatePresence mode="wait">
        {showSidebar && (
          <motion.aside
            className={styles.sidebar}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isMobile ? windowWidth : 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
          >
            <SideBar userId={userId} toggleSidebar={toggleSidebar} />
          </motion.aside>
        )}
      </AnimatePresence>
      <main className={styles.containerMain}>
        {title && (
          <div>
            <h2 className={styles.title}>{title}</h2>
          </div>
        )}
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: showSidebar ? 0 : 48 }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
          className={styles.spanLink}
        >
          {title ? `/ ${title}` : "/ Current Recipe"}
        </motion.span>
        <Outlet />
        <Footer />
      </main>
    </div>
  );
};

export default DashboardLayout;

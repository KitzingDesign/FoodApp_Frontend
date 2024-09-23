import { Outlet } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion, useCycle } from "framer-motion";

import styles from "./DashboardLayout.module.css";
import SideBar from "./SideBar";
import SidebarOpenCloseIcon from "../../public/sidebarOpenClose";

import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../features/auth/authSlice";

const DashboardLayout = () => {
  const userId = useSelector(selectCurrentUserId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isSidebarOpen ? 0 : -220 }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
        className={styles.visibleIcon}
        onClick={() => setIsSidebarOpen(() => !isSidebarOpen)}
      >
        <SidebarOpenCloseIcon />
      </motion.div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            className={styles.sidebar}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
          >
            <SideBar userId={userId} />
          </motion.aside>
        )}
      </AnimatePresence>
      <main className={styles.containerMain}>
        <h2 className={styles.title}>Add New Recipe</h2>
        <span className={styles.spanLink}>/ Add Recipe</span>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

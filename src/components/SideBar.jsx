import { useState } from "react";
import styles from "./SideBar.module.css";
import ProfileIcon from "../../public/profile";

function SideBar() {
  const [open, setOpen] = useState(true);

  const Menus = [
    { title: "Overview", src: "Overview" },
    { title: "Transactions", src: "Transactions" },
    { title: "Loyalty Cards", src: "Card", gap: true },
    { title: "Subscriptions ", src: "Calendar" },
    { title: "Debts", src: "Debt" },
    { title: "Legal information", src: "Legal" },
    { title: "Notifications ", src: "Notifications", gap: true },
    { title: "Setting", src: "Settings" },
  ];

  const projects = [
    { id: 1, title: "Project Alpha" },
    { id: 2, title: "Project Beta" },
    { id: 3, title: "Project Gamma" },
    { id: 4, title: "Project Delta" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.titleContainer}>
        <div className={styles.profileContainer}>
          <ProfileIcon />
        </div>
        {/* // change to real name */}
        <h2 className={styles.sidebarTitle}>Your Projects</h2>
      </div>
      <div className={styles.addButton}>
        <button>+ Add Project</button>
      </div>
      <ul className={styles.projectList}>
        {projects.map((project) => {
          let cssClasses = styles.projectItem;

          //   if (project.id === selectedProjectId) {
          //     cssClasses += ` ${styles.selectedProject}`;
          //   }

          return (
            <li key={project.id}>
              <button className={cssClasses}>{project.title}</button>
            </li>
          );
        })}
      </ul>
      <div className={styles.test}></div>
    </aside>
  );
}

export default SideBar;

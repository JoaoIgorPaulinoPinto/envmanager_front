"use client";

import { Lock, Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import SideBarLogic from "./side-bar.logic";
import styles from "./side-bar.module.css";
export default function SideBar() {
  const {
    getUserInfo,
    user,
    status,
    errorMessage,
    getUserProjects,
    projects,
    theme,
    toggleTheme,
  } = SideBarLogic();
  const selected = projects.length > 0 ? projects[0] : null;
  useEffect(() => {
    getUserInfo();
    getUserProjects();
  }, []);
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandDot}></span>
        EnvManager
      </div>

      <div className={styles.sectionTitle}>Projects</div>
      <div className={styles.projectList}>
        {status === "loading" && (
          <div className={styles.loading}>Loading projects...</div>
        )}
        {status === "error" && (
          <div className={styles.errorBanner}>{errorMessage}</div>
        )}

        {status === "idle" && projects.length === 0 ? (
          <div className={styles.emptyState}>
            No projects yet. Create one via the API to get started.
          </div>
        ) : (
          projects.map((project) => (
            <button
              key={project.id}
              type="button"
              aria-current={selected?.id === project.id ? "page" : undefined}
              className={`${styles.projectCard} ${
                selected?.id === project.id ? styles.projectActive : ""
              }`}
              disabled
            >
              <div className={styles.projectHeader}>
                <h3>{project.name}</h3>
                {project.need_password && <Lock color="#a1a1aa" size={17} />}
              </div>
              <p>{project.description}</p>
            </button>
          ))
        )}
      </div>

      <div className={styles.userBar}>
        <div className={styles.userMeta}>
          <div className={styles.avatar}>
            {user?.user_name?.substring(0, 2).toUpperCase() || "??"}
          </div>
          <div>
            <div className={styles.userName}>
              {user?.user_name || "Unknown User"}
            </div>
            <div className={styles.userId}>{user?.id || "Not available"}</div>
          </div>
        </div>

        <details className={styles.userMenu}>
          <summary className={styles.menuTrigger} aria-label="Open menu">
            <span></span>
            <span></span>
            <span></span>
          </summary>
          <div className={styles.menuPanel}>
            {/* TOGGLE TEMA FUNCIONAL */}
            <button
              type="button"
              className={`${styles.themeSlider} ${
                theme === "light" ? styles.themeSliderLight : ""
              }`}
              onClick={toggleTheme}
              role="switch"
              aria-checked={theme === "light"}
              aria-label="Toggle theme"
            >
              <span
                className={`${styles.themeIconLeft} ${theme === "dark" ? styles.themeIconActive : ""}`}
              >
                <Moon size={14} />
              </span>
              <span
                className={`${styles.themeIconRight} ${theme === "light" ? styles.themeIconActive : ""}`}
              >
                <Sun size={14} />
              </span>
              <span className={styles.themeKnob}>
                {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
              </span>
            </button>

            <button type="button">Settings</button>
            <button type="button" className={styles.danger}>
              Logout
            </button>
          </div>
        </details>
      </div>
    </aside>
  );
}

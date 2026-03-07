"use client";

import { Lock, Moon, Sun } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import SideBarLogic from "./side-bar.logic";
import styles from "./side-bar.module.css";
export default function SideBar() {
  const {
    getUserInfo,
    user,
    status,
    errorMessage,
    getUserProjects,
    createProject,
    projects,
    theme,
    toggleTheme,
  } = SideBarLogic();
  const router = useRouter();
  const pathname = usePathname();
  const selectedProjectId = pathname?.startsWith("/projects/")
    ? pathname.split("/")[2]
    : projects[0]?.id;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPassword, setProjectPassword] = useState("");
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    getUserInfo();
    getUserProjects();
  }, []);

  const handleCreateProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = projectName.trim();
    const description = projectDescription.trim();
    const password = projectPassword.trim();

    if (!name) {
      setCreateError("Project name is required.");
      return;
    }

    setCreateError("");
    setIsCreating(true);
    try {
      await createProject({
        name,
        description,
        password: password.length > 0 ? password : null,
      });
      setShowCreateForm(false);
      setProjectName("");
      setProjectDescription("");
      setProjectPassword("");
    } catch (error: unknown) {
      setCreateError(
        error instanceof Error ? error.message : "Error creating project"
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandDot}></span>
        EnvManager
      </div>

      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Projects</div>
        <button
          type="button"
          className={styles.addProjectButton}
          aria-label="Create project"
          onClick={() => {
            setShowCreateForm((current) => !current);
            setCreateError("");
          }}
        >
          +
        </button>
      </div>

      {showCreateForm && (
        <form className={styles.createProjectForm} onSubmit={handleCreateProject}>
          <input
            type="text"
            placeholder="Project name"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            disabled={isCreating}
            required
          />
          <textarea
            placeholder="Description"
            value={projectDescription}
            onChange={(event) => setProjectDescription(event.target.value)}
            disabled={isCreating}
            rows={3}
          />
          <input
            type="password"
            placeholder="Password (optional)"
            value={projectPassword}
            onChange={(event) => setProjectPassword(event.target.value)}
            disabled={isCreating}
          />
          {createError && <div className={styles.errorBanner}>{createError}</div>}
          <div className={styles.createProjectActions}>
            <button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              disabled={isCreating}
              onClick={() => {
                setShowCreateForm(false);
                setCreateError("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

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
              aria-current={selectedProjectId === project.id ? "page" : undefined}
              className={`${styles.projectCard} ${
                selectedProjectId === project.id ? styles.projectActive : ""
              }`}
              onClick={() => {
                router.push(`/projects/${project.id}`);
              }}
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

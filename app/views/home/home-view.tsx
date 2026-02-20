"use client";

import { Download, Link, Moon, Pencil, Sun, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./home-view.module.css";
import { projects } from "./projects";

type EditTarget =
  | "project-name"
  | "project-summary"
  | `variable-key:${string}`
  | `variable-value:${string}`;

type HomeViewProps = {
  projectId: string;
};

export default function HomeView({ projectId }: HomeViewProps) {
  const router = useRouter();
  const [editingTarget, setEditingTarget] = useState<EditTarget | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return window.localStorage.getItem("theme") === "light" ? "light" : "dark";
  });
  const selected =
    projects.find((project) => project.id === projectId) ?? projects[0];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const startEditing = (target: EditTarget, currentValue: string) => {
    setEditingTarget(target);
    setDraftValue(currentValue);
  };

  const stopEditing = () => {
    setEditingTarget(null);
    setDraftValue("");
  };

  const saveEditing = () => {
    stopEditing();
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST" }).then(() => {
      router.push("/");
    });
  };

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandDot}></span>
          EnvManager
        </div>
        <div className={styles.sectionTitle}>Projects</div>
        <div className={styles.projectList}>
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => {
                stopEditing();
                router.push(`/projects/${project.id}`);
              }}
              aria-current={selected.id === project.id ? "page" : undefined}
              className={`${styles.projectCard} ${
                selected.id === project.id ? styles.projectActive : ""
              }`}
            >
              <div className={styles.projectHeader}>
                <h3>{project.name}</h3>
                <span>Updated on {project.updatedAt}</span>
              </div>
              <p>{project.description}</p>
            </button>
          ))}
        </div>
        <div className={styles.userBar}>
          <div className={styles.userMeta}>
            <div className={styles.avatar}>JG</div>
            <div>
              <div className={styles.userName}>Joao Gomes</div>
              <div className={styles.userRole}>Administrator</div>
            </div>
          </div>
          <details className={styles.userMenu}>
            <summary className={styles.menuTrigger} aria-label="Open menu">
              <span></span>
              <span></span>
              <span></span>
            </summary>
            <div className={styles.menuPanel}>
              <button
                type="button"
                className={`${styles.themeSlider} ${
                  theme === "light" ? styles.themeSliderLight : ""
                }`}
                onClick={toggleTheme}
                role="switch"
                aria-checked={theme === "light"}
                aria-label={
                  theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
              >
                <span
                  className={`${styles.themeIconLeft} ${
                    theme === "dark" ? styles.themeIconActive : ""
                  }`}
                >
                  <Moon size={16} />
                </span>
                <span
                  className={`${styles.themeIconRight} ${
                    theme === "light" ? styles.themeIconActive : ""
                  }`}
                >
                  <Sun size={16} />
                </span>
                <span className={styles.themeKnob}>
                  {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
                </span>
              </button>
              <button type="button">Settings</button>
              <button
                type="button"
                className={styles.danger}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </details>
        </div>
      </aside>

      <main className={styles.content}>
        <header className={styles.contentHeader}>
          <div>
            <div className={styles.eyebrow}>Selected project</div>
            <div className={styles.titleRow}>
              {editingTarget === "project-name" ? (
                <input
                  type="text"
                  value={draftValue}
                  onChange={(event) => setDraftValue(event.target.value)}
                  onBlur={stopEditing}
                  className={styles.projectNameInput}
                  aria-label="Project name"
                  autoFocus
                />
              ) : (
                <h1>{selected.name}</h1>
              )}
              <button
                type="button"
                className={styles.inlineEdit}
                aria-label="Edit project name"
                onClick={() => startEditing("project-name", selected.name)}
              >
                <Pencil size={16} />
              </button>
              {editingTarget === "project-name" ? (
                <button
                  type="button"
                  className={styles.saveEdit}
                  onClick={saveEditing}
                >
                  Save
                </button>
              ) : null}
            </div>
            <div className={styles.descRow}>
              {editingTarget === "project-summary" ? (
                <input
                  type="text"
                  value={draftValue}
                  onChange={(event) => setDraftValue(event.target.value)}
                  onBlur={stopEditing}
                  className={styles.inlineTextInput}
                  aria-label="Project description"
                  autoFocus
                />
              ) : (
                <p>{selected.summary}</p>
              )}
              <button
                type="button"
                className={styles.inlineEdit}
                aria-label="Edit project description"
                onClick={() =>
                  startEditing("project-summary", selected.summary)
                }
              >
                <Pencil size={16} />
              </button>
              {editingTarget === "project-summary" ? (
                <button
                  type="button"
                  className={styles.saveEdit}
                  onClick={saveEditing}
                >
                  Save
                </button>
              ) : null}
            </div>
          </div>
          <div className={styles.actions}>
            <div className={styles.actionGroup}>
              <span className={styles.actionLabel}>Project actions</span>
              <div className={styles.actionPills}>
                <button
                  type="button"
                  className={styles.iconPill}
                  aria-label="Export"
                >
                  <Download size={16} />
                </button>
                <button
                  type="button"
                  className={styles.iconPill}
                  aria-label="Copy invite link"
                >
                  <Link size={16} />
                </button>
                <button
                  type="button"
                  className={styles.iconPill}
                  aria-label="Invite"
                >
                  <UserPlus size={16} />
                </button>
                <button type="button" className={styles.danger}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Variables</h2>
            <span>Last synced today</span>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {selected.variables.map((variable) => (
                <tr key={variable.key}>
                  <td>
                    <div className={styles.cellInline}>
                      {editingTarget === `variable-key:${variable.key}` ? (
                        <input
                          type="text"
                          value={draftValue}
                          onChange={(event) =>
                            setDraftValue(event.target.value)
                          }
                          onBlur={stopEditing}
                          className={styles.tableTextInput}
                          aria-label="Variable name"
                          autoFocus
                        />
                      ) : (
                        variable.key
                      )}
                      <button
                        type="button"
                        className={styles.inlineEdit}
                        aria-label="Edit variable name"
                        onClick={() =>
                          startEditing(
                            `variable-key:${variable.key}`,
                            variable.key,
                          )
                        }
                      >
                        <Pencil size={14} />
                      </button>
                      {editingTarget === `variable-key:${variable.key}` ? (
                        <button
                          type="button"
                          className={styles.saveEdit}
                          onClick={saveEditing}
                        >
                          Save
                        </button>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <div className={styles.cellInline}>
                      {editingTarget === `variable-value:${variable.key}` ? (
                        <input
                          type="text"
                          value={draftValue}
                          onChange={(event) =>
                            setDraftValue(event.target.value)
                          }
                          onBlur={stopEditing}
                          className={styles.tableTextInput}
                          aria-label="Variable value"
                          autoFocus
                        />
                      ) : (
                        variable.value
                      )}
                      <button
                        type="button"
                        className={styles.inlineEdit}
                        aria-label="Edit variable value"
                        onClick={() =>
                          startEditing(
                            `variable-value:${variable.key}`,
                            variable.value,
                          )
                        }
                      >
                        <Pencil size={14} />
                      </button>
                      {editingTarget === `variable-value:${variable.key}` ? (
                        <button
                          type="button"
                          className={styles.saveEdit}
                          onClick={saveEditing}
                        >
                          Save
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

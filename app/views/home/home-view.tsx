"use client";

import { Download, Pencil, UserPlus } from "lucide-react";
import { useEffect } from "react";
import SideBar from "../components/side-bar";
import styles from "./home-view.module.css";
import HomeLogic from "./home.logic";

export default function HomeView() {
  const { getProjectData, project, status, errorMessage } = HomeLogic();
  const projectId = "69a203c48c55c90b4503c2b1";

  const noticeMessage = "";
  const projectPassword = "••••••••";
  const inviteUserId = "usr_8821";
  const inviteToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
  const inviteAccepted = true;

  useEffect(() => {
    getProjectData(projectId);
    document.title = `EnvManager - ${project ? project.name : "Loading..."}`;
  }, [projectId]);

  return (
    <div className={styles.page}>
      <SideBar />;
      <main className={styles.content}>
        <header className={styles.contentHeader}>
          <div>
            <div className={styles.eyebrow}>Selected project</div>
            <div className={styles.titleRow}>
              {/* Exibe diretamente o nome do projeto */}
              <h1>{project?.name}</h1>
              <button type="button" className={styles.inlineEdit} disabled>
                <Pencil size={16} />
              </button>
            </div>
            <div className={styles.descRow}>
              <p>{project?.description}</p>
              <button type="button" className={styles.inlineEdit} disabled>
                <Pencil size={16} />
              </button>
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
                  disabled
                >
                  <Download size={16} />
                </button>

                <button
                  type="button"
                  className={styles.iconPill}
                  aria-label="Invite"
                  disabled
                >
                  <UserPlus size={16} />
                </button>
                <button type="button" className={styles.danger} disabled>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </header>

        {noticeMessage && (
          <div className={styles.noticeBanner}>{noticeMessage}</div>
        )}

        <section className={styles.tableCard}>
          <div className={styles.unlockRow}>
            <div>
              <div className={styles.unlockTitle}>Unlock variables</div>
              <p className={styles.unlockHint}>
                Enter password to decrypt production keys.
              </p>
            </div>
            <div className={styles.unlockForm}>
              <input type="password" value={projectPassword} readOnly />
              <button type="button">Unlock</button>
            </div>
          </div>

          <div className={styles.tableHeader}>
            <h2>Variables</h2>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapeia as chaves do objeto 'variables' do projeto */}
              {project?.variables?.map((variable) => (
                <tr key={variable.id}>
                  <td>
                    <div className={styles.cellInline}>
                      {variable.variable}
                      <button
                        type="button"
                        className={styles.inlineEdit}
                        disabled
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className={styles.cellInline}>
                      <span className={styles.maskedValue}>
                        {variable.value}
                      </span>
                      <button
                        type="button"
                        className={styles.inlineEdit}
                        disabled
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.managementGrid}>
          {/* Card: People */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>People & access</h3>
              <span>Invite members</span>
            </div>
            <div className={styles.cardBody}>
              <label className={styles.field}>
                <span>User ID</span>
                <input type="text" value={inviteUserId} readOnly />
              </label>
              <button type="button" className={styles.primaryAction}>
                Send invite
              </button>
            </div>
          </div>

          {/* Card: Answer Invite */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Pending invite</h3>
              <span>JWT Validation</span>
            </div>
            <div className={styles.cardBody}>
              <label className={styles.field}>
                <span>Invite token</span>
                <input type="text" value={inviteToken} readOnly />
              </label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggle} ${inviteAccepted ? styles.toggleActive : ""}`}
                  disabled
                >
                  Accept
                </button>
                <button
                  type="button"
                  className={`${styles.toggle} ${!inviteAccepted ? styles.toggleActive : ""}`}
                  disabled
                >
                  Decline
                </button>
              </div>
              <button type="button" className={styles.secondaryAction}>
                Submit
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

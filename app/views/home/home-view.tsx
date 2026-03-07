"use client";

import { Download, Pencil, UserPlus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import SideBar from "../components/side-bar";
import styles from "./home-view.module.css";
import HomeLogic from "./home.logic";

type HomeViewProps = {
  projectId?: string;
};

export default function HomeView({ projectId }: HomeViewProps) {
  const {
    addProjectVariable,
    clearProject,
    getProjectData,
    getSelectedProjectData,
    project,
    selectedProject,
    sendProjectInvite,
    status,
    errorMessage,
  } = HomeLogic();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [projectPassword, setProjectPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [showAddVariableForm, setShowAddVariableForm] = useState(false);
  const [newVariableName, setNewVariableName] = useState("");
  const [newVariableValue, setNewVariableValue] = useState("");
  const [isSavingVariable, setIsSavingVariable] = useState(false);
  const [variableError, setVariableError] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteUserId, setInviteUserId] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");

  const noticeMessage = inviteMessage;

  useEffect(() => {
    if (!projectId) {
      clearProject();
      setShowPasswordModal(false);
      setShowInviteModal(false);
      setInviteMessage("");
      return;
    }

    let cancelled = false;
    const loadProject = async () => {
      setInviteMessage("");
      const projectMeta = await getSelectedProjectData(projectId);
      if (cancelled) return;

      if (projectMeta?.need_password) {
        clearProject();
        setProjectPassword("");
        setPasswordError("");
        setShowPasswordModal(true);
        return;
      }

      setShowPasswordModal(false);
      await getProjectData(projectId, null);
    };

    loadProject();
    return () => {
      cancelled = true;
    };
  }, [clearProject, getProjectData, getSelectedProjectData, projectId]);

  useEffect(() => {
    document.title = `EnvManager - ${project ? project.name : "Loading..."}`;
  }, [project]);

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectId) return;

    const password = projectPassword.trim();
    if (!password) {
      setPasswordError("Password is required.");
      return;
    }

    setPasswordError("");
    setIsSubmittingPassword(true);
    const success = await getProjectData(projectId, password);
    if (success) {
      setShowPasswordModal(false);
    } else {
      setPasswordError("Invalid password or access denied.");
    }
    setIsSubmittingPassword(false);
  };

  const handleAddVariable = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectId) return;

    const variable = newVariableName.trim();
    const value = newVariableValue.trim();

    if (!variable || !value) {
      setVariableError("Variable and value are required.");
      return;
    }

    setVariableError("");
    setIsSavingVariable(true);
    try {
      await addProjectVariable(projectId, variable, value);
      setNewVariableName("");
      setNewVariableValue("");
      setShowAddVariableForm(false);
    } catch (error: unknown) {
      setVariableError(
        error instanceof Error ? error.message : "Failed to add variable.",
      );
    } finally {
      setIsSavingVariable(false);
    }
  };

  const handleInviteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectId) return;

    const invitedUserId = inviteUserId.trim();
    if (!invitedUserId) {
      setInviteError("User ID is required.");
      return;
    }

    setInviteError("");
    setIsSendingInvite(true);
    try {
      await sendProjectInvite(projectId, invitedUserId);
      setInviteMessage("Invite sent successfully.");
      setInviteUserId("");
      setShowInviteModal(false);
    } catch (error: unknown) {
      setInviteError(
        error instanceof Error ? error.message : "Failed to send invite.",
      );
    } finally {
      setIsSendingInvite(false);
    }
  };

  return (
    <div className={styles.page}>
      <SideBar />
      <main className={styles.content}>
        {!projectId && (
          <div className={styles.noticeBanner}>
            Select a project in the sidebar to load its details.
          </div>
        )}
        {status === "loading" && !showPasswordModal && (
          <div className={styles.noticeBanner}>Loading project...</div>
        )}
        {status === "error" && errorMessage && !showPasswordModal && (
          <div className={styles.errorBanner}>{errorMessage}</div>
        )}

        {project && (
          <header className={styles.contentHeader}>
            <div>
              <div className={styles.eyebrow}>Selected project</div>
              <div className={styles.titleRow}>
                <h1>{project.name}</h1>
                <button type="button" className={styles.inlineEdit} disabled>
                  <Pencil size={16} />
                </button>
              </div>
              <div className={styles.descRow}>
                <p>{project.description}</p>
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
                    onClick={() => {
                      setInviteError("");
                      setInviteMessage("");
                      setShowInviteModal(true);
                    }}
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
        )}

        {noticeMessage && (
          <div className={styles.noticeBanner}>{noticeMessage}</div>
        )}

        {project && (
          <section className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h2>Variables</h2>
              <button
                type="button"
                className={styles.addVariableButton}
                onClick={() => {
                  setShowAddVariableForm((current) => !current);
                  setVariableError("");
                }}
              >
                +
              </button>
            </div>
            {showAddVariableForm && (
              <form
                className={styles.addVariableForm}
                onSubmit={handleAddVariable}
              >
                <input
                  type="text"
                  placeholder="Variable"
                  value={newVariableName}
                  onChange={(event) => setNewVariableName(event.target.value)}
                  disabled={isSavingVariable}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={newVariableValue}
                  onChange={(event) => setNewVariableValue(event.target.value)}
                  disabled={isSavingVariable}
                />
                <button type="submit" disabled={isSavingVariable}>
                  {isSavingVariable ? "Saving..." : "Add"}
                </button>
              </form>
            )}
            {variableError && (
              <div className={styles.errorBanner}>{variableError}</div>
            )}

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {project.variables?.map((variable) => (
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
        )}
      </main>

      {showPasswordModal && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <form className={styles.modalCard} onSubmit={handlePasswordSubmit}>
            <h3>Password required</h3>
            <p>
              The project{" "}
              <strong>{selectedProject?.name ?? "selected project"}</strong>{" "}
              requires a password to load details.
            </p>
            <input
              type="password"
              placeholder="Project password"
              value={projectPassword}
              onChange={(event) => setProjectPassword(event.target.value)}
              disabled={isSubmittingPassword}
              autoFocus
            />
            {(passwordError || errorMessage) && (
              <div className={styles.errorBanner}>
                {passwordError || errorMessage}
              </div>
            )}
            <div className={styles.modalActions}>
              <button type="submit" disabled={isSubmittingPassword}>
                {isSubmittingPassword ? "Unlocking..." : "Unlock"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showInviteModal && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <form className={styles.modalCard} onSubmit={handleInviteSubmit}>
            <h3>Invite user</h3>
            <p>Send access to this project using the target user email.</p>
            <input
              type="email"
              placeholder="User Email"
              value={inviteUserId}
              onChange={(event) => setInviteUserId(event.target.value)}
              disabled={isSendingInvite}
              autoFocus
            />
            {inviteError && (
              <div className={styles.errorBanner}>{inviteError}</div>
            )}
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                disabled={isSendingInvite}
              >
                Cancel
              </button>
              <button type="submit" disabled={isSendingInvite}>
                {isSendingInvite ? "Sending..." : "Send invite"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

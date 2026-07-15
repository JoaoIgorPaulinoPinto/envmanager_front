"use client";

import { Download, Pencil, Plus, Trash, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import SideBar from "../components/side-bar";
import styles from "./home-view.module.css";
import HomeLogic from "./home.logic";

type HomeViewProps = {
  projectId?: string;
};

export default function HomeView({ projectId }: HomeViewProps) {
  const router = useRouter();
  const {
    addProjectVariable,
    clearProject,
    getProjectData,
    getSelectedProjectData,
    project,
    selectedProject,
    sendProjectInvite,
    updateProjectInfo,
    updateProjectVariable,
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
  const [editingProjectName, setEditingProjectName] = useState(false);
  const [editingProjectDescription, setEditingProjectDescription] = useState(false);
  const [projectNameDraft, setProjectNameDraft] = useState("");
  const [projectDescriptionDraft, setProjectDescriptionDraft] = useState("");
  const [isSavingProjectInfo, setIsSavingProjectInfo] = useState(false);
  const [projectInfoError, setProjectInfoError] = useState("");
  const [editingVariable, setEditingVariable] = useState<{
    id: string;
    field: "variable" | "value";
  } | null>(null);
  const [variableDraft, setVariableDraft] = useState("");
  const [isSavingVariableEdit, setIsSavingVariableEdit] = useState(false);
  const [variableEditError, setVariableEditError] = useState("");

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

  useEffect(() => {
    if (!project) return;
    setProjectNameDraft(project.name);
    setProjectDescriptionDraft(project.description ?? "");
    setEditingProjectName(false);
    setEditingProjectDescription(false);
    setProjectInfoError("");
    setEditingVariable(null);
    setVariableDraft("");
    setVariableEditError("");
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

  const handleSaveProjectName = async () => {
    if (!projectId || !project) return;
    const nextName = projectNameDraft.trim();
    if (!nextName) {
      setProjectInfoError("Project name is required.");
      return;
    }
    setProjectInfoError("");
    setIsSavingProjectInfo(true);
    try {
      await updateProjectInfo(projectId, nextName, projectDescriptionDraft.trim());
      setEditingProjectName(false);
    } catch (error: unknown) {
      setProjectInfoError(
        error instanceof Error ? error.message : "Failed to update project name.",
      );
    } finally {
      setIsSavingProjectInfo(false);
    }
  };

  const handleSaveProjectDescription = async () => {
    if (!projectId || !project) return;
    const nextDescription = projectDescriptionDraft.trim();
    setProjectInfoError("");
    setIsSavingProjectInfo(true);
    try {
      await updateProjectInfo(projectId, projectNameDraft.trim(), nextDescription);
      setEditingProjectDescription(false);
    } catch (error: unknown) {
      setProjectInfoError(
        error instanceof Error
          ? error.message
          : "Failed to update project description.",
      );
    } finally {
      setIsSavingProjectInfo(false);
    }
  };

  const startVariableEdit = (
    variableId: string,
    field: "variable" | "value",
    value: string,
  ) => {
    setVariableEditError("");
    setEditingVariable({ id: variableId, field });
    setVariableDraft(value);
  };

  const handleSaveVariableEdit = async () => {
    if (!projectId || !editingVariable) return;
    const nextValue = variableDraft.trim();

    setVariableEditError("");
    setIsSavingVariableEdit(true);
    try {
      await updateProjectVariable(
        projectId,
        editingVariable.id,
        editingVariable.field,
        nextValue,
      );
      setEditingVariable(null);
      setVariableDraft("");
    } catch (error: unknown) {
      setVariableEditError(
        error instanceof Error ? error.message : "Failed to update variable.",
      );
    } finally {
      setIsSavingVariableEdit(false);
    }
  };

  return (
    <div className={styles.page}>
      <SideBar />
      <main className={styles.content}>
        {!projectId && (
          <div className={styles.noticeBanner} role="status" aria-live="polite">
            Select a project in the sidebar to load its details.
          </div>
        )}
        {status === "loading" && !showPasswordModal && (
          <div className={styles.noticeBanner} role="status" aria-live="polite">
            Loading project...
          </div>
        )}
        {status === "error" && errorMessage && !showPasswordModal && (
          <div className={styles.errorBanner} role="alert" aria-live="assertive">
            {errorMessage}
          </div>
        )}

        {project && (
          <header className={styles.contentHeader}>
            <div>
              <div className={styles.eyebrow}>Selected project</div>
              <div className={styles.titleRow}>
                {editingProjectName ? (
                  <>
                    <input
                      className={styles.projectNameInput}
                      value={projectNameDraft}
                      onChange={(event) => setProjectNameDraft(event.target.value)}
                      disabled={isSavingProjectInfo}
                      autoFocus
                    />
                    <button
                      type="button"
                      className={styles.saveEdit}
                      onClick={handleSaveProjectName}
                      disabled={isSavingProjectInfo}
                    >
                      {isSavingProjectInfo ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className={styles.inlineEdit}
                      onClick={() => {
                        setProjectNameDraft(project.name);
                        setEditingProjectName(false);
                      }}
                      disabled={isSavingProjectInfo}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h1>{project.name}</h1>
                    <button
                      type="button"
                      className={styles.inlineEdit}
                      onClick={() => {
                        setProjectInfoError("");
                        setEditingProjectName(true);
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                  </>
                )}
              </div>
              <div className={styles.descRow}>
                {editingProjectDescription ? (
                  <>
                    <input
                      className={styles.inlineTextInput}
                      value={projectDescriptionDraft}
                      onChange={(event) =>
                        setProjectDescriptionDraft(event.target.value)
                      }
                      disabled={isSavingProjectInfo}
                      autoFocus
                    />
                    <button
                      type="button"
                      className={styles.saveEdit}
                      onClick={handleSaveProjectDescription}
                      disabled={isSavingProjectInfo}
                    >
                      {isSavingProjectInfo ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className={styles.inlineEdit}
                      onClick={() => {
                        setProjectDescriptionDraft(project.description ?? "");
                        setEditingProjectDescription(false);
                      }}
                      disabled={isSavingProjectInfo}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>{project.description}</p>
                    <button
                      type="button"
                      className={styles.inlineEdit}
                      onClick={() => {
                        setProjectInfoError("");
                        setEditingProjectDescription(true);
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                  </>
                )}
              </div>
              {projectInfoError && (
                <div className={styles.errorBanner}>{projectInfoError}</div>
              )}
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
          <div className={styles.noticeBanner} role="status" aria-live="polite">
            {noticeMessage}
          </div>
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
                <Plus size={23} />
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
              <div className={styles.errorBanner} role="alert" aria-live="assertive">
                {variableError}
              </div>
            )}
            {variableEditError && (
              <div className={styles.errorBanner} role="alert" aria-live="assertive">
                {variableEditError}
              </div>
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
                  <tr key={variable.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.cellInline}>
                        {variable.variable}
                        <button
                          type="button"
                          className={styles.inlineEdit}
                          onClick={() =>
                            startVariableEdit(
                              variable.id,
                              "variable",
                              variable.variable,
                            )
                          }
                        >
                          <Pencil size={14} />
                        </button>
                        {editingVariable?.id === variable.id &&
                          editingVariable.field === "variable" && (
                            <>
                              <input
                                className={styles.tableTextInput}
                                value={variableDraft}
                                onChange={(event) =>
                                  setVariableDraft(event.target.value)
                                }
                                disabled={isSavingVariableEdit}
                                autoFocus
                              />
                              <button
                                type="button"
                                className={styles.saveEdit}
                                onClick={handleSaveVariableEdit}
                                disabled={isSavingVariableEdit}
                              >
                                {isSavingVariableEdit ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                className={styles.inlineEdit}
                                onClick={() => {
                                  setEditingVariable(null);
                                  setVariableDraft("");
                                }}
                                disabled={isSavingVariableEdit}
                              >
                                Cancel
                              </button>
                            </>
                          )}
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
                          onClick={() =>
                            startVariableEdit(variable.id, "value", variable.value)
                          }
                        >
                          <Pencil size={14} />
                        </button>
                        {editingVariable?.id === variable.id &&
                          editingVariable.field === "value" && (
                            <>
                              <input
                                className={styles.tableTextInput}
                                value={variableDraft}
                                onChange={(event) =>
                                  setVariableDraft(event.target.value)
                                }
                                disabled={isSavingVariableEdit}
                                autoFocus
                              />
                              <button
                                type="button"
                                className={styles.saveEdit}
                                onClick={handleSaveVariableEdit}
                                disabled={isSavingVariableEdit}
                              >
                                {isSavingVariableEdit ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                className={styles.inlineEdit}
                                onClick={() => {
                                  setEditingVariable(null);
                                  setVariableDraft("");
                                }}
                                disabled={isSavingVariableEdit}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                    </div>
                    </td>
                    <td>
                      <div className={styles.lastColumnCell}>
                       <button
                                type="button"
                                onClick={() => {
                                  setEditingVariable(null);
                                  setVariableDraft("");
                                }}
                                disabled={isSavingVariableEdit}
                              >
                                <Trash size={14}/>
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
              <div className={styles.errorBanner} role="alert" aria-live="assertive">
                {passwordError || errorMessage}
              </div>
            )}
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setProjectPassword("");
                  setPasswordError("");
                  clearProject();
                  router.push("/projects");
                }}
                disabled={isSubmittingPassword}
              >
                Cancel
              </button>
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
              <div className={styles.errorBanner} role="alert" aria-live="assertive">
                {inviteError}
              </div>
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

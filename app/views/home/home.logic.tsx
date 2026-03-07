"use client";

import GetProjectDetailsResponse from "@/app/models/getProjectDatailsResponse";
import GetProjectsResponse from "@/app/models/getProjectsResponse";
import InviteService from "@/app/services/InviteService";
import ProjectService from "@/app/services/ProjectService";
import { useCallback, useState } from "react";

const projectService = new ProjectService();
const inviteService = new InviteService();
function HomeLogic() {
  const [project, setProject] = useState<GetProjectDetailsResponse | null>(
    null,
  );
  const [selectedProject, setSelectedProject] =
    useState<GetProjectsResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const getSelectedProjectData = useCallback(async (projectId: string) => {
    try {
      const projects = await projectService.listAll();
      const selected = projects.find(
        (projectItem) => projectItem.id === projectId,
      );
      setSelectedProject(selected ?? null);
      return selected ?? null;
    } catch {
      setSelectedProject(null);
      return null;
    }
  }, []);

  const getProjectData = useCallback(
    async (projectId: string, password: string | null = null) => {
      setStatus("loading");
      setErrorMessage("");
      try {
        const projectDetails = await projectService.getDetails(
          projectId,
          password,
        );
        if (projectDetails) {
          setStatus("idle");
          setProject(projectDetails);
          return true;
        }
        setStatus("error");
        setErrorMessage("Project not found");
        setProject(null);
        return false;
      } catch (error: unknown) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Error fetching project details",
        );
        setProject(null);
        return false;
      }
    },
    [],
  );

  const clearProject = useCallback(() => {
    setProject(null);
    setErrorMessage("");
    setStatus("idle");
  }, []);

  const addProjectVariable = useCallback(
    async (projectId: string, variable: string, value: string) => {
      if (!project) {
        throw new Error("Project not loaded");
      }

      const variables = [
        ...project.variables.map((item) => ({
          id: item.id,
          variable: item.variable,
          value: item.value,
        })),
        {
          id: null,
          variable,
          value,
        },
      ];

      await projectService.syncVariables(projectId, variables);

      setProject((currentProject) => {
        if (!currentProject) return currentProject;
        return {
          ...currentProject,
          variables: [
            ...currentProject.variables,
            {
              id: `${Date.now()}`,
              variable,
              value,
            },
          ],
        };
      });
    },
    [project],
  );

  const sendProjectInvite = useCallback(
    async (projectId: string, invitedUserEmail: string) => {
      await inviteService.sendInvite({
        project_id: projectId,
        invited_user_email: invitedUserEmail,
      });
    },
    [],
  );

  return {
    clearProject,
    addProjectVariable,
    sendProjectInvite,
    getProjectData,
    getSelectedProjectData,
    project,
    selectedProject,
    status,
    errorMessage,
  };
}

export default HomeLogic;

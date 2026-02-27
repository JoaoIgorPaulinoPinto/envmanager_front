"use client";

import GetProjectDetailsResponse from "@/app/models/getProjectDatailsResponse";
import ProjectService from "@/app/services/ProjectService";
import { useState } from "react";

const projectService = new ProjectService();
function HomeLogic() {
  const [project, setProject] = useState<GetProjectDetailsResponse>();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const getProjectData = async (projectId: string) => {
    setStatus("loading");
    try {
      const projectDetails = await projectService.getDetails(projectId);
      if (projectDetails) {
        setStatus("idle");
        setProject(projectDetails);
        console.log("Project details fetched successfully:", projectDetails);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Error fetching project details");
    }
  };

  return {
    getProjectData,
    project,
    status,
    errorMessage,
  };
}

export default HomeLogic;

import GetProjectDetailsResponse from "../models/getProjectDatailsResponse";
import GetProjectsResponse from "../models/getProjectsResponse";
import api, { getApiErrorMessage } from "./api";

export interface ProjectCreate {
  name: string;
  description: string;
  password?: string | null;
}

export interface ProjectUpdate {
  project_id: string;
  project_name: string;
  project_description: string;
}

export interface ProjectAdminUpdate {
  project_id: string;
  user_id: string;
}

export interface ProjectDetailsRequest {
  password: string | null;
}

export interface ProjectVariable {
  id?: string | null;
  variable: string;
  value: string;
}

export default class ProjectService {
  async create(data: ProjectCreate) {
    try {
      const response = await api.post("/project", data);
      return response.data as Record<string, unknown>;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async listAll(): Promise<GetProjectsResponse[]> {
    try {
      const response = await api.get("/project");
      console.log("Projects list response:", response.data);
      return response.data as GetProjectsResponse[];
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getDetails(projectId: string): Promise<GetProjectDetailsResponse> {
    try {
      const response = await api.post(`/project/${projectId}/details`);
      return response.data as GetProjectDetailsResponse;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async update(data: ProjectUpdate) {
    try {
      const response = await api.put("/projects/update", data);
      return response.data as Record<string, unknown>;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async promoteAdmin(data: ProjectAdminUpdate) {
    try {
      const response = await api.put("/projects/admin", data);
      return response.data as Record<string, unknown>;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async syncVariables(projectId: string, variables: ProjectVariable[]) {
    try {
      const response = await api.put("/projects/variables", {
        project_id: projectId,
        variables,
      });
      return response.data as Record<string, unknown>;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

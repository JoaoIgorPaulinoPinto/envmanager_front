import api, { getApiErrorMessage } from "./api";

export interface InviteRequest {
  invited_user_id: string;
  project_id: string;
}

export interface InviteAnswer {
  token: string;
  accepted: boolean;
}

export default class InviteService {
  async sendInvite(data: InviteRequest) {
    try {
      const response = await api.post("/invite", data);
      return response.data as Record<string, unknown>;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async answerInvite(data: InviteAnswer) {
    try {
      const response = await api.post("/invite/answer", data);
      return response.data as Record<string, unknown>;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

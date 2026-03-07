import api, { getApiErrorMessage } from "./api";

export interface InviteRequest {
  invited_user_email: string;
  project_id: string;
}

export interface InviteAnswer {
  token: string;
  accepted: boolean;
}

export default class InviteService {
  async sendInvite(data: InviteRequest) {
    try {
      // O backend provavelmente retorna { message: string } ou o convite criado
      const response = await api.post("/invite", data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async answerInvite(data: InviteAnswer) {
    try {
      const response = await api.post("/invite/answer", data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

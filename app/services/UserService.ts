import GetUserResponse from "../models/getUserResponse";
import api, { getApiErrorMessage } from "./api";

export default class UserService {
  async listAll(): Promise<GetUserResponse[]> {
    try {
      const response = await api.get("/user/all");
      const payload = response.data as unknown;

      if (Array.isArray(payload)) {
        return payload as GetUserResponse[];
      }

      if (
        payload &&
        typeof payload === "object" &&
        Array.isArray((payload as { users?: unknown[] }).users)
      ) {
        return (payload as { users: GetUserResponse[] }).users;
      }

      return [];
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getById(userId: string): Promise<GetUserResponse | null> {
    try {
      const response = await api.get(`/user/${userId}`);
      const payload = response.data as unknown;

      if (!payload || typeof payload !== "object") {
        return null;
      }

      const data = payload as Record<string, unknown>;
      if (data.user && typeof data.user === "object") {
        return data.user as GetUserResponse;
      }

      return payload as GetUserResponse;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async GetUserData(): Promise<GetUserResponse | null> {
    try {
      const response = await api.get("/user/me");
      const payload = response.data as unknown;

      if (!payload || typeof payload !== "object") {
        throw new Error("Invalid user response format.");
      }

      const data = payload as Record<string, unknown>;
      if (data.user && typeof data.user === "object") {
        return data.user as GetUserResponse;
      }

      return payload as GetUserResponse;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

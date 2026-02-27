import GetUserResponse from "../models/getUserResponse";
import api, { getApiErrorMessage } from "./api";

export default class UserService {
  async GetUserData(): Promise<GetUserResponse | null> {
    try {
      const response = await api.get(`/user/me`);
      console.log("User data response:", response.data);
      if (!response.data || !response.data.user) {
        throw new Error("Invalid response format: 'user' field is missing");
      }
      return response.data.user as GetUserResponse;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

"use client";
import GetProjectsResponse from "@/app/models/getProjectsResponse";
import GetUserResponse from "@/app/models/getUserResponse";
import { useState } from "react";
import ProjectsService from "../../services/ProjectService";
import UserService from "../../services/UserService";

const userService = new UserService();
const projectsService = new ProjectsService();
function SideBarLogic() {
  const [user, setUser] = useState<GetUserResponse | null>(null);

  const [projects, setProjects] = useState<GetProjectsResponse[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const getUserInfo = async () => {
    setStatus("loading");
    try {
      const userInfo = await userService.GetUserData();
      if (userInfo) {
        setUser(userInfo);
        setStatus("idle");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Error fetching user data");
    }
  };
  const getUserProjects = async () => {
    setStatus("loading");
    try {
      const projectsInfo = await projectsService.listAll();
      if (projectsInfo) {
        setProjects(projectsInfo);

        setStatus("idle");
        console.log("Projects fetched successfully:", projectsInfo);
        console.log("Projects state updated:", projects);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Error fetching user projects");
    }
  };
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };
  return {
    getUserProjects,
    getUserInfo,
    toggleTheme,
    user,
    projects,
    status,
    errorMessage,
    theme,
  };
}

export default SideBarLogic;

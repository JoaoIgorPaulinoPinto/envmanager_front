import { redirect } from "next/navigation";
import { projects } from "../views/home/projects";

export default function ProjectsPage() {
  redirect(`/projects/${projects[0].id}`);
}

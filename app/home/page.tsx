import { redirect } from "next/navigation";
import { projects } from "../views/home/projects";

export default function HomePage() {
  redirect(`/projects/${projects[0].id}`);
}

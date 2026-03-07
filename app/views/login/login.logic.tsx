"use client";
import AuthService from "@/app/services/AuthService";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useLoginLogic() {
  const authService = new AuthService();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const ChangeMode = () => {
    if (mode === "login") {
      setMode("signup");
    } else {
      setMode("login");
    }
  };

  const handleSubmit = async () => {
    setStatus("loading");
    if (mode === "signup") {
      if (password !== confirmPassword) {
        setStatus("error");
        setErrorMessage("The passwords do not match.");
        return;
      } else {
        try {
          await authService.register({
            user_name: name,
            email,
            password,
          });
          setStatus("idle");
        } catch {
          setStatus("error");
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      }
    } else {
      try {
        await authService.login({
          email,
          password,
        });
        setStatus("idle");
        router.push("/projects");
      } catch {
        setStatus("error");
        setErrorMessage("Invalid email or password. Please try again.");
      }
    }
  };
  return {
    mode,
    name,
    email,
    password,
    status,
    errorMessage,
    confirmPassword,
    handleSubmit,
    setStatus,
    setMode,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    ChangeMode,
  };
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import styles from "./login-view.module.css";

export default function LoginView() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const nextTheme = storedTheme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetch("/api/auth/login", { method: "POST" });
    router.push("/projects");
  };

  const handleDemoLogin = async () => {
    await fetch("/api/auth/login", { method: "POST" });
    router.push("/projects");
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>EnvManager</div>
        <div className={styles.modeSwitch}>
          <button
            type="button"
            className={mode === "login" ? styles.modeActive : ""}
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === "signup" ? styles.modeActive : ""}
            onClick={() => setMode("signup")}
          >
            Create account
          </button>
        </div>

        <h1>{mode === "login" ? "Access your account" : "Create a new account"}</h1>
        <p>
          {mode === "login"
            ? "Sign in to manage environment variables and secrets for your projects."
            : "Create your account to start managing your project environments."}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label className={styles.field}>
              <span>Name</span>
              <input type="text" placeholder="Your full name" />
            </label>
          ) : null}

          <label className={styles.field}>
            <span>Email</span>
            <input type="email" placeholder="you@company.com" />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input type="password" placeholder="Enter your password" />
          </label>

          {mode === "signup" ? (
            <label className={styles.field}>
              <span>Confirm password</span>
              <input type="password" placeholder="Re-enter your password" />
            </label>
          ) : null}

          <button type="submit" className={styles.submit}>
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={handleDemoLogin}
        >
          Continue without authentication (demo)
        </button>
      </section>
    </main>
  );
}

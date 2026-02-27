"use client";

import styles from "./login-view.module.css";

export default function LoginView() {
  const mode: "login" | "signup" = "login";
  const name = "Camila Santos";
  const email = "camila@empresa.com";
  const password = "••••••••";
  const confirmPassword = "••••••••";
  const status: "idle" | "loading" | "error" = "idle";
  const errorMessage = "";

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>EnvManager</div>
        <div className={styles.modeSwitch}>
          <button
            type="button"
            className={mode === "login" ? styles.modeActive : ""}
            disabled
          >
            Entrar
          </button>
          <button
            type="button"
            className={mode === "signup" ? styles.modeActive : ""}
            disabled
          >
            Criar conta
          </button>
        </div>

        <h1>{mode === "login" ? "Acesse sua conta" : "Criar nova conta"}</h1>
        <p>
          {mode === "login"
            ? "Entre para gerenciar variaveis e segredos dos seus projetos."
            : "Crie seu acesso para comecar a gerenciar seus ambientes."}
        </p>

        {status === "error" && errorMessage ? (
          <div className={styles.errorBanner}>{errorMessage}</div>
        ) : null}

        <form className={styles.form}>
          {mode === "signup" ? (
            <label className={styles.field}>
              <span>Nome</span>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={name}
                readOnly
              />
            </label>
          ) : null}

          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              placeholder="voce@empresa.com"
              value={email}
              readOnly
            />
          </label>

          <label className={styles.field}>
            <span>Senha</span>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              readOnly
            />
          </label>

          {mode === "signup" ? (
            <label className={styles.field}>
              <span>Reescrever senha</span>
              <input
                type="password"
                placeholder="Repita sua senha"
                value={confirmPassword}
                readOnly
              />
            </label>
          ) : null}

          <button
            type="submit"
            className={styles.submit}
            disabled
          >
            {status === "loading"
              ? "Entrando..."
              : mode === "login"
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>

      </section>
    </main>
  );
}

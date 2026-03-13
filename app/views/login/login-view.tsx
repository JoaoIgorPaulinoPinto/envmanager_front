"use client";

import styles from "./login-view.module.css";
import { useLoginLogic } from "./login.logic";

export default function LoginView() {
  const {
    setMode,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    mode,
    name,
    email,
    password,
    status,
    errorMessage,
    confirmPassword,
  } = useLoginLogic();

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>EnvManager</div>

        <div className={styles.modeSwitch}>
          <button
            onClick={() => setMode("login")}
            type="button"
            className={mode === "login" ? styles.modeActive : ""}
            // Removed 'disabled' so users can actually click it
          >
            Entrar
          </button>
          <button
            onClick={() => setMode("signup")}
            type="button"
            className={mode === "signup" ? styles.modeActive : ""}
          >
            Criar conta
          </button>
        </div>

        <h1>{mode === "login" ? "Acesse sua conta" : "Crie uma conta"}</h1>
        <p>
          {mode === "login"
            ? "Entre para gerenciar variáveis e segredos dos seus projetos."
            : "Crie seu acesso para começar a gerenciar seus ambientes."}
        </p>

        {status === "error" && errorMessage && (
          <div className={styles.errorBanner} role="alert" aria-live="assertive">{errorMessage}</div>
        )}

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(); // Call your logic's submit function here
          }}
        >
          {mode === "signup" && (
            <label className={styles.field}>
              <span>Nome</span>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}

          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              placeholder="voce@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Senha</span>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {mode === "signup" && (
            <label className={styles.field}>
              <span>Reescrever senha</span>
              <input
                type="password"
                placeholder="Repita sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          )}

          <button
            type="submit"
            className={styles.submit}
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Processando..."
              : mode === "login"
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>
      </section>
    </main>
  );
}

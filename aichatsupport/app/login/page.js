"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../firebaseConfig";
import styles from "./home.module.css"; // Import your module CSS

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect to the main page after successful login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <video autoPlay muted loop className={styles.videoBg}>
        <source src="./videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.loginFormContainer}>
        <h1 className={styles.loginTitle}>Login</h1>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.loginInput}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.loginInput}
          />
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
        <p className={styles.registerText}>
          Don&apos;t have an account?{" "}
          <a href="/register" className={styles.registerLink}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

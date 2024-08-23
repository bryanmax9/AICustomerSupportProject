"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../firebaseConfig";
import styles from "./home.module.css"; // Import your module CSS

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/login"); // Redirect to login page after successful registration
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <video autoPlay muted loop className={styles.videoBg}>
        <source src="./videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.registerFormContainer}>
        <h1 className={styles.registerTitle}>Register</h1>
        <form onSubmit={handleRegister} className={styles.registerForm}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.registerInput}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.registerInput}
          />
          <button type="submit" className={styles.registerButton}>
            Register
          </button>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
        <p className={styles.loginText}>
          Already have an account?{" "}
          <a href="/login" className={styles.loginLink}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

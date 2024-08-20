"use client"; // Mark this as a client component
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for router
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import HomePage from "./HomePage";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter(); // Use router from next/navigation

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        if (typeof window !== "undefined") {
          router.replace("/login"); // Use replace instead of push to redirect
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <HomePage />;
}

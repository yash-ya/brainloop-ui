"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUser(decodedToken);
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("authToken");
          router.push("/login");
        }
      } else {
        router.push("/login");
      }

      setLoading(false);
    }
  }, [router]);

  return { user, loading };
};

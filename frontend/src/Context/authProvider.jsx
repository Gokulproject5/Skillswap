"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import toast from "react-hot-toast";

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch(`${api_url}/me`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Unauthorized");

      const data = await response.json();
      setUser(data.user);
      return data.user;
    } catch (e) {
      setUser(null);
      return null;
    }
  }, [api_url]);

  useEffect(() => {
    refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const login = useCallback(async () => {
    const me = await refreshSession();
    if (me) {
      toast.success("Login successful!");
      router.push(me.role === "admin" ? "/admin" : "/dashboard");
    } else {
      toast.error("Failed to sync user session.");
    }
  }, [refreshSession, router]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${api_url}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setUser(null);
      router.replace("/auth/login");
    }
  }, [api_url, router]);

  const value = useMemo(() => ({
    user,
    loading,
    logout,
    login,
    isAuthenticated: !!user,
  }), [user, loading, logout, login]);

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MonarchRole, MonarchUser } from "@/lib/constants";

const AUTH_COOKIE = "monarch_auth";
const ROLE_COOKIE = "monarch_role";

const setCookie = (name: string, value: string, days = 7) => {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
};

const clearCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

type AuthState = {
  user: MonarchUser | null;
  role: MonarchRole | null;
  isAuthenticated: boolean;
  login: (user: MonarchUser, role: MonarchRole) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      login: (user, role) => {
        setCookie(AUTH_COOKIE, "1");
        setCookie(ROLE_COOKIE, role);
        set({ user, role, isAuthenticated: true });
      },
      logout: () => {
        clearCookie(AUTH_COOKIE);
        clearCookie(ROLE_COOKIE);
        set({ user: null, role: null, isAuthenticated: false });
      },
    }),
    {
      name: "monarch-auth",
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

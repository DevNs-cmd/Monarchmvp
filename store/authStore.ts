"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MonarchRole, MonarchUser } from "@/lib/constants";

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
        set({ user, role, isAuthenticated: true });
      },
      logout: () => {
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

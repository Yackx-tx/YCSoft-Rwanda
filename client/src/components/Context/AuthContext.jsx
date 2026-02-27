import { createContext, useContext } from "react";

// ============================================================
// 🔧 AUTH CONTEXT — shares login state across all components
// ============================================================
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext); // call this in any component to get user info
}

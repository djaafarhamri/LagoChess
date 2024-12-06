import { createContext, useContext } from "react";
import { UserType } from "../types/types";

// Create the UserContext
export const UserContext = createContext({} as {user: UserType | null, login: (userData: UserType) => void, logout: () => void});

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);


import React, { useCallback, useState } from "react";
import { UserContext } from "./UserContext";
import { UserType } from "../types/types";

type Props = {
  children: React.ReactNode
}

// UserContext Provider
export const UserProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserType | null>(null);
  
    const login = useCallback((userData: UserType) => {
      setUser(userData); // Set the user data after login
    }, []);
  
    const logout = () => {
      setUser(null); // Clear user data on logout
    };
  
    return (
      <UserContext.Provider value={{ user, login, logout }}>
        {children}
      </UserContext.Provider>
    );
  };
  
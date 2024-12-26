import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { UserType } from "../types/types";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, login } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const getUser = async (login: (userData: UserType) => void) => {
      try {
        const response = await fetch(
          `${
            !import.meta.env.VITE_API_URL ||
            import.meta.env.VITE_API_URL === "undefined"
              ? ""
              : import.meta.env.VITE_API_URL
          }/api/auth/getUser`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        setLoading(false);
        if (response.ok) {
          const data = await response.json();
          login(data.user);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser(login);
  }, [login]);
  if (loading) return <div>loading...</div>
  if (user) return children;
  navigate("/login");
};

export default PrivateRoute;

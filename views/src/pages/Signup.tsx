import { FormEvent, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      return;
    }

    try {
      const response = await fetch(
        `${
          !import.meta.env.VITE_API_URL ||
          import.meta.env.VITE_API_URL === "undefined"
            ? ""
            : import.meta.env.VITE_API_URL
        }/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        return;
      }
      const data = await response.json();
      login(data.user);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="form-container">
        <h2 className="form-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="form-button">
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-[#f0f0f0]">Already have an account? </span>
          <button
            className="form-link"
            onClick={() => navigate("/login")}
          >
            Login!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

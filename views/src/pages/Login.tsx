import { FormEvent, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();

  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Replace this with your API call
    if (!username || !password) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? ""}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, password}),
        credentials: 'include'
      });

      if (!response.ok) {
        return;
      }
      const data = await response.json()
      login(data.user)
      navigate("/")
    } catch (err) {
      console.log(err)
    }
  };
    return (
      <div className="min-h-screen flex justify-center items-center p-4 mt-[-100px]">
        <div className="bg-[#454545] px-12 py-20 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block bg-[#454545] w-full px-3 py-2 border-2 border-white-600 rounded-md text-sm text-white placeholder-gray-400
                           focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block bg-[#454545] w-full px-3 py-2 border-2 border-white-600 rounded-md text-sm text-white placeholder-gray-400
                           focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#BA8B00] hover:bg-[#E1A800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );

};

export default Login;

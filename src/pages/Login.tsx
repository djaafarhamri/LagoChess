import { FormEvent, useState } from "react";
import { useUser } from "../context/UserContext";

type Props = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const Login = ({ setIsLoggedIn }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Replace this with your API call
    if (!username || !password) {
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, password}),
        credentials: 'include'
      });

      if (!response.ok) {
        return;
      }
      const data = await response.json()
      console.log(data?.user)
      setIsLoggedIn(true)
      login(data.user)
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

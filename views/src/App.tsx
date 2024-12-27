import { Route, Routes } from 'react-router'
import './App.css'
import Game from './pages/Game'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import { useUser } from './context/UserContext'
import { useEffect } from 'react'
import { UserType } from './types/types'
import Puzzles from './pages/Puzzles'
import Analyze from './pages/Analyze'
import PrivateRoute from './components/Private'
import GamesList from './pages/GamesList'

function App() {

  const { login } = useUser();
  useEffect(() => {
    const getUser = async (login: (userData: UserType) => void) => {
      try {
        const response = await fetch(`${!import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === "undefined" ? "":import.meta.env.VITE_API_URL}/api/auth/getUser`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          login(data.user);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser(login);
  }, [login]);

  return (
    <Routes >
      <Route path='/game/:id' element={<PrivateRoute><Game /></PrivateRoute>} />
      <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path='/puzzles' element={<PrivateRoute><Puzzles /></PrivateRoute>} />
      <Route path='/analyze/:id' element={<PrivateRoute><Analyze /></PrivateRoute>} />
      <Route path='/analyze' element={<PrivateRoute><GamesList /></PrivateRoute>} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>
  )
}

export default App

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

function App() {
  const { user } = useUser()

  const { login } = useUser();
  useEffect(() => {
    const getUser = async (login: (userData: UserType) => void) => {
      try {
        const response = await fetch("/api/auth/getUser", {
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
      <Route path='/game/:id' element={user && <Game />} />
      <Route path='/' element={<Home />} />
      <Route path='/puzzles' element={<Puzzles />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>
  )
}

export default App

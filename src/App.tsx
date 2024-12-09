import { Route, Routes } from 'react-router'
import './App.css'
import Game from './pages/Game'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/Signup'

function App() {
  return (
    <Routes >
      <Route path='/game/:id' element={<Game />} />
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>
  )
}

export default App

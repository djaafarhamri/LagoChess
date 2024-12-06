import { Route, Routes } from 'react-router'
import './App.css'
import Game from './pages/Game'
import Home from './pages/Home'

function App() {
  return (
    <Routes >
      <Route path='/game/:id' element={<Game />} />
      <Route path='/' element={<Home />} />
    </Routes>
  )
}

export default App

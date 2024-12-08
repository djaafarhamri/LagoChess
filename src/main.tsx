import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { socket, SocketContext } from './context/socket.ts'
import { UserProvider } from './context/UserProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <SocketContext.Provider value={socket}>
      <UserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </SocketContext.Provider>
  </>
)

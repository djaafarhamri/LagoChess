// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { socket, SocketContext } from './context/socket.ts'
import { UserProvider } from './context/UserProvider.tsx'
import NavbarLogo from './components/NavLogo.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <SocketContext.Provider value={socket}>
      <UserProvider>
        <BrowserRouter>
          <div className="background">
            <div className="background container mx-auto px-4 py-8">
              <NavbarLogo />
              <App />
            </div>
          </div>
        </BrowserRouter>
      </UserProvider>
    </SocketContext.Provider>
  </>
)

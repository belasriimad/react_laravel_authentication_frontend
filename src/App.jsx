import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Header from "./components/layouts/Header"
import { useEffect, useState } from "react"
import { getConfig, BASE_URL } from "./helpers/config"
import { AuthContext } from './context/authContext'
import axios from "axios"

function App() {
  const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem('currentToken')))
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const fetchCurrentlyLoggedInUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user`, getConfig(accessToken))
        setCurrentUser(response.data.user)
      } catch (error) {
          if (error?.response?.status === 401) {
              localStorage.removeItem('currentToken')
              setCurrentUser(null)
              setAccessToken('')
          }
          console.log(error)
      }
    }
    if (accessToken) fetchCurrentlyLoggedInUser()
  }, [accessToken])

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, currentUser, setCurrentUser}}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/register" element={ <Register /> } />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App

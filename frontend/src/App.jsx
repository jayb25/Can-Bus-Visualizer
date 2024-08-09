import React, { useContext, useEffect } from 'react'
import Home from './Home'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import DBC from './DBC'
import Login from './Login'
import Register from './Register'
import { AuthContext } from './AuthContext'


const App = () => {
  const { token } = useContext(AuthContext)
  return (
    <>
      <div>
        {token ? <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><Link to="/">Home</Link></div>
            <div><Link to="/logout">Logout</Link></div>
          </div>
          <hr />
        </div> : <h1>DBC Visualizer</h1>}

      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/dbcs/:dbcId" element={token ? <DBC /> : <Navigate to="/login" />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </>
  )
}

const Logout = () => {
  const { logout } = useContext(AuthContext)
  useEffect(() => {
    logout()
  }, [])

  return <Navigate to="/login" />
}

export default App
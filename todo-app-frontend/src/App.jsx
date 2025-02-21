import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import ProfileSettings from "./components/ProfileSettings"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Navigate to="/tasks" />} />
        <Route path="/tasks" element={<Dashboard />} />
        <Route path="/calendar" element={<Dashboard />} />
        <Route path="/notes" element={<Dashboard />} />
        <Route path="/project/:projectId/*" element={<Dashboard />} />
        <Route path="/profile/settings" element={<ProfileSettings />} />
        <Route path="/" element={<Navigate to="/tasks" />} />
      </Routes>
    </Router>
  )
}

export default App


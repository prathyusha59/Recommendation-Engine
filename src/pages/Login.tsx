import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/api'
import { setToken } from '../utils/token'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post('/auth/login', { email, password })
      setToken(response.data.token)
      localStorage.setItem("role", response.data.role)
      localStorage.setItem("name", response.data.name)

      // Admin అయితే Admin page కి
      if (response.data.role === "ADMIN") {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      alert('Invalid email or password')
      console.log(error)
    }
  }

  return (
    <div className="container">
      <form className="form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div style={{ textAlign: "right", marginTop: "-8px" }}>
          <Link to="/forgot-password"
            style={{ fontSize: "12px", color: "#6b7280" }}>
            Forgot password?
          </Link>
        </div>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
import React, {useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log

        fetch(import.meta.env.VITE_API_URL +'/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.error) {
                setError(data.error)
            } else {
                setError('')
                // alert('User logged in successfully')
                login(data.token)
                navigate('/')
            }
        })
        .catch(error => {
            console.error(error)
            setError('Error logging in user')
        })
    }

    const handleChange = (e) => {
        if  (e.target.name === 'email') {
            setEmail(e.target.value)
        } else {
            setPassword(e.target.value)
        }
    }

  return (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div style={{color: 'red'}}>
                {error}
            </div>
            <label htmlFor="email">Email:</label>
            <input onChange={handleChange} type="email" name="email" id="email" required/>
            <label htmlFor="password">Password:</label>
            <input onChange={handleChange} type="password" name="password" id="password" required/>
            <button>Login</button>
            <div>
            Don't have an account? <Link to="/register">Register</Link>
            </div>
        </form>
    </div>
  )
}

export default Login
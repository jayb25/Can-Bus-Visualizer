import React, {useState} from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log

        fetch(import.meta.env.VITE_API_URL +'/api/users/register', {
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
                alert('User registered successfully')
            }
        })
        .catch(error => {
            console.error(error)
            setError('Error registering user')
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
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
            <div style={{color: 'red'}}>
                {error}
            </div>
            <label htmlFor="email">Email:</label>
            <input onChange={handleChange}  type="email" name="email" id="email" required/>
            <label htmlFor="password">Password:</label>
            <input onChange={handleChange} type="password" name="password" id="password" required/>
            <button>Register</button>
            <div>
            Already have an account? <Link to="/login">Login</Link>
            </div>
        </form>
    </div>
  )
}

export default Register
import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from './AuthContext'

function Home() {
  const [dbcs, setDbcs] = useState([])
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/dbcs', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'

      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setDbcs(data.dbcs)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    fetch(import.meta.env.VITE_API_URL +'/api/dbcs/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        // 'Content-Type': 'application/json'

      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        alert(data.message)
        navigate(`/dbcs/${data.id}`)
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleDelete = (event) => {
    const dbcId = event.target.id
    fetch(import.meta.env.VITE_API_URL +`/api/dbcs/${dbcId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        alert(data.message)
        setDbcs(dbcs.filter(dbc => dbc.ID !== parseInt(dbcId)))

      })
      .catch(error => {
        console.error(error)
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="dbc">Upload a DBC file:</label>
        <input type="file" name="dbc" id="dbc" accept=".dbc" required />
        <button>Upload</button>
      </form>
      <h3>CAN BUS DBCS files</h3>
      <div>
        {dbcs.length === 0 && <div>No DBC files uploaded yet</div>}
        {dbcs.map(dbc => (
          <div key={dbc.ID} style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              {dbc.JSON.SourceFile !== undefined ? <Link to={`/dbcs/${dbc.ID}`}>{dbc.JSON.SourceFile}</Link> : <Link to={`/dbcs/${dbc.ID}`}>Unknown</Link>}
            </div>
            <div>
              <button id={dbc.ID} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home

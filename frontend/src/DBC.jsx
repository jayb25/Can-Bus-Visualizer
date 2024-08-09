import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import LineChart from './LineChart';
import { AuthContext } from './AuthContext'



const DBC = () => {
    const [dbc, setDbc] = useState(null)
    const [lineChartData, setLineChartData] = useState(null)
    const [logs, setLogs] = useState([])
    const { dbcId } = useParams()
    const { token } = useContext(AuthContext)

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + `/api/dbcs/${dbcId}`,{
            headers: {
                Authorization: `Bearer ${token}` 
            }
        })
            .then(response => response.json())
            .then(data => {
                setDbc(data)
            })
            .catch(error => {
                console.error(error)
            })
    }, [dbcId])

    const handleSubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)

        fetch(import.meta.env.VITE_API_URL +'/api/dbcs/'+dbcId+'/logs/upload', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setLogs(data.dbcMessages)
                // setLineChartData({
                //     labels: data.dbcMessages[0].Signals[0].Frames.map(frame => frame.TimeStamp),
                //     datasets: [
                //         {
                //             label: data.dbcMessages[0].Signals[0].Name,
                //             data: data.dbcMessages[0].Signals[0].Frames.map(frame => frame.PhysicalValue),
                //             fill: false,
                //             backgroundColor: 'rgb(255, 99, 132)',
                //             borderColor: 'rgba(255, 99, 132, 0.2)',
                //         }
                //     ]
                // })
            })
            .catch(error => {
                console.error(error)
            })
    }

    return (
        <div>
            {dbc && (
                <>
                    <details>
                        <summary>JSON data of {dbc.dbc.SourceFile}</summary>
                        <pre>{JSON.stringify(dbc, null, 2)}</pre>
                    </details>
                </>
            )}

            <form onSubmit={handleSubmit}>
                {/* upload log files */}
                <label htmlFor="log">Upload log file for visualization</label>
                <input type="file" name="log" id="log" accept=".csv" required />
                <button type="submit">Upload</button>
            </form>
            <div>
                
                {logs.map((log, i) => (
                    log.Signals.map((signal, j) => (
                        // if(signal.Frames.length > 0)
                        
                        <label key={j}><input type="radio" name="signal" id="" value={i+":"+j}  
                        onChange={(e) => {
                            setLineChartData({
                                labels: log.Signals[j].Frames.map(frame => frame.TimeStamp),
                                datasets: [
                                    {
                                        label: log.Signals[j].Name,
                                        data: log.Signals[j].Frames.map(frame => frame.PhysicalValue),
                                        fill: false,
                                        backgroundColor: 'rgb(255, 99, 132)',
                                        borderColor: 'rgba(255, 99, 132, 0.2)',
                                    }
                                ]
                            })
                        }}
                        />  {signal.Name}</label>
                        
                    ))
                ))}
            </div>

            <div style={{backgroundColor:"white", maxHeight:"400px"}}>
                {/* <LineChart data={logs} options={{}} /> */}
                {lineChartData && <LineChart data={lineChartData} options={{}} />}
            </div>

        </div>
    )
}

export default DBC
import { useEffect, useState } from 'react'
import { Container, Grid } from '@mui/material'

import SupportWorkerCard from './components/SupportWorkerCard'

const baseUrl = 'http://localhost:8080'
const url = baseUrl + '/getSupportWorkerVisits'

function App() {
  const [supportWorkers, setSupportWorkers] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const { data } = await response.json()

        // transform the data by collating worker's visits by supportWorkerId
        const transformedData = data.reduce((result, visit) => {
          const {
            supportWorkerId,
            name,
            contractedHours,
            avatar,
            ...visitData
          } = visit

          // create new worker obj if none exists
          if (!result[supportWorkerId]) {
            result[supportWorkerId] = {
              supportWorkerId,
              name,
              contractedHours,
              avatar,
              visits: []
            }
          }

          // update the mapping
          result[supportWorkerId].visits.push(visitData)
          return result
        }, {})

        setSupportWorkers(Object.values(transformedData))
      } catch (error) {
        console.error()
      }
    }
    fetchData()
  }, [])

  return (
    <Container>
      <Grid container spacing={2}>
        {supportWorkers &&
          supportWorkers.map((worker) => (
            <Grid item xs={12} sm={6} md={4} key={worker.supportWorkerId}>
              <SupportWorkerCard {...worker} />
            </Grid>
          ))}
      </Grid>
    </Container>
  )
}

export default App

import express, { Request, Response } from 'express'
import cors from 'cors'

import { getVisits, getSupportWorkers } from './utils'
import { SupportWorkerVisit } from './types'

const PORT = 8080
const app = express()

app.use(express.json())
app.use(cors())

app.get('/getSupportWorkers', (_req: Request, res: Response) => {
  const supportWorkers = getSupportWorkers()
  res.json({ data: supportWorkers })
})

app.get('/getVisits', (_req: Request, res: Response) => {
  const visits = getVisits()
  res.json({ data: visits })
})

app.get(
  '/getSupportWorkerVisits/:supportWorkerId',
  (req: Request, res: Response) => {
    try {
      const supportWorkerId = parseInt(req.params.supportWorkerId)

      // fetch support workers and filter by id
      const supportWorkers = getSupportWorkers()
      const supportWorker = supportWorkers.find(
        (worker) => worker.supportWorkerId === supportWorkerId
      )

      if (supportWorker) {
        // fetch visits, filter by supportWorkerId and sort by startDateTime
        const visits = getVisits()
        const filteredVisits = visits
          .filter((visit) => {
            return visit.supportWorkerId === supportWorkerId
          })
          .sort((a, b) => a.startDateTime - b.startDateTime)

        // combine support worker and visits
        const supportWorkerVisits: SupportWorkerVisit[] = filteredVisits.map(
          (visit) => ({
            ...visit,
            name: supportWorker.name,
            contractedHours: supportWorker.contractedHours,
            avatar: supportWorker.avatar
          })
        )

        res.json({ data: supportWorkerVisits })
      } else {
        res
          .status(404)
          .json({ error: `No support worker with id ${supportWorkerId}` })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

app.get('/getSupportWorkerVisits', (req: Request, res: Response) => {
  try {
    // fetch support workers
    const supportWorkers = getSupportWorkers()
    const visits = getVisits()

    // combine support worker and visits
    const supportWorkerVisits: SupportWorkerVisit[] = supportWorkers.flatMap(
      (worker) => {
        // find all visits for this support worker
        const workerVisits = visits.filter(
          (visit) => visit.supportWorkerId === worker.supportWorkerId
        )

        // combine support worker data with each visit
        return workerVisits.map((visit) => ({
          ...visit,
          name: worker.name,
          contractedHours: worker.contractedHours,
          avatar: worker.avatar
        }))
      }
    )

    res.json({ data: supportWorkerVisits })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))

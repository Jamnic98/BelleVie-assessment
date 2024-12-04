import express, { Request, Response } from 'express'

import { getVisits, getSupportWorkers } from './utils'
import { SupportWorkerVisit } from './types'

const PORT = 8080
const app = express()

app.use(express.json())

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
            name: supportWorker.name,
            contractedHours: supportWorker.contractedHours,
            ...visit
          })
        )

        res.json({ supportWorkerVisits })
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

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))

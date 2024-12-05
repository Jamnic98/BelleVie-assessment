import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'

import LinearProgressWithLabel from './LinearProgressWithLabel'

export default function SupportWorkerCard({
  avatar,
  contractedHours,
  name,
  visits
}) {
  const calculateContractedHoursPercentage = () => {
    // sum total hours
    const totalHours = visits.reduce((sum, visit) => {
      const visitMilliseconds = visit.endDateTime - visit.startDateTime
      const visitHours = visitMilliseconds / (1000 * 60 * 60)
      return sum + visitHours
    }, 0)

    // calculate as % of contractedHours
    const hoursSpentPercentage = (totalHours / contractedHours) * 100
    return Math.min(Math.floor(hoursSpentPercentage), 100)
  }

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar src={avatar}>{avatar.length ? '' : name.slice(0, 1)}</Avatar>
        }
        title={name}
      />
      <CardContent>
        <LinearProgressWithLabel value={calculateContractedHoursPercentage()} />
      </CardContent>
    </Card>
  )
}

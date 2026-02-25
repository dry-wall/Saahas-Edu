import StatsWidget from './StatsWidget'
import ProgressCard from './ProgressCard'
import ActivityFeed from './ActivityFeed'
import Card from '../common/Card'

export default function StudentDashboard({ user }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsWidget label="Modules Done" value="12" icon="📚" color="purple" />
        <StatsWidget label="Current Streak" value="7d" icon="🔥" color="orange" />
        <StatsWidget label="Quiz Score Avg" value="82%" icon="🎯" color="blue" />
        <StatsWidget label="Hours Learned" value="34" icon="⏱️" color="green" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-700 mb-4">Learning Progress</h3>
          <div className="space-y-4">
            <ProgressCard subject="Braille" progress={75} color="purple" />
            <ProgressCard subject="Sign Language" progress={50} color="blue" />
            <ProgressCard subject="Communication Skills" progress={60} color="green" />
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-700 mb-4">Recent Activity</h3>
          <ActivityFeed />
        </Card>
      </div>
    </div>
  )
}
import Navbar from '../components/common/Navbar'
import SignCamera from '../components/signlanguage/SignCamera'
import SignDisplay from '../components/signlanguage/SignDisplay'
import Card from '../components/common/Card'

export default function SignLanguagePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">🤟 Sign Language</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-semibold text-gray-700 mb-4">Camera Feed</h2>
            <SignCamera />
          </Card>
          <Card>
            <h2 className="font-semibold text-gray-700 mb-4">Detected Gesture</h2>
            <SignDisplay gesture={null} />
            <p className="text-xs text-gray-400 mt-3 text-center">Connect your sign language detection model here</p>
          </Card>
        </div>
      </main>
    </div>
  )
}
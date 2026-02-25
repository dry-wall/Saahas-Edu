import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import DisabilitySelector from './DisabilitySelctor'

export default function LoginForm() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ email: '', password: '', name: '', disability: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleStep1 = (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return setError('Please fill in all fields')
    setError('')
    setStep(2)
  }

  const handleStep2 = () => {
    if (!form.disability) return setError('Please select your disability type')
    login({ email: form.email, name: form.name || form.email.split('@')[0], disability: form.disability })
    navigate('/home')
  }

  return (
    <div className="w-full">
      {step === 1 ? (
        <form onSubmit={handleStep1} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
            Continue →
          </button>
        </form>
      ) : (
        <div className="space-y-5">
          <p className="text-sm text-gray-500 text-center">Help us personalize your experience</p>
          <DisabilitySelector selected={form.disability} onChange={(val) => setForm({ ...form, disability: val })} />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
              Back
            </button>
            <button onClick={handleStep2} className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
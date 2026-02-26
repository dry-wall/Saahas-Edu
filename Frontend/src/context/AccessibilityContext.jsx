import { createContext, useState, useContext } from 'react'

const AccessibilityContext = createContext(null)

export function AccessibilityProvider({ children }) {
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState('normal')

  return (
    <AccessibilityContext.Provider value={{ highContrast, setHighContrast, fontSize, setFontSize }}>
      <div className={highContrast ? 'bg-black text-white min-h-screen' : 'min-h-screen'}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => useContext(AccessibilityContext)
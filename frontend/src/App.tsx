import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { GlassmorphismNavigation } from './components/ui/glassmorphism-navigation'
import { BackgroundPaths } from './components/ui/background-paths'
import WelcomePage from './pages/WelcomePage'
import type { Tab } from './components/NavTabs'
import Dashboard from './pages/Dashboard'
import ContentLibrary from './pages/ContentLibrary'
import PublishAndTrack from './pages/PublishAndTrack'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [showWelcome, setShowWelcome] = useState(true)

  return (
    <BackgroundPaths>
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            className="min-h-screen w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5 }}
          >
            <WelcomePage onEnter={() => setShowWelcome(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            className="min-h-screen text-slate-100 antialiased pt-24 pb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassmorphismNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'content' && <ContentLibrary />}
              {activeTab === 'publish' && <PublishAndTrack />}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </BackgroundPaths>
  )
}

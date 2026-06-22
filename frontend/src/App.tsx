import { useState } from 'react'

import { GlassmorphismNavigation } from './components/ui/glassmorphism-navigation'
import type { Tab } from './components/NavTabs'
import Dashboard from './pages/Dashboard'
import ContentLibrary from './pages/ContentLibrary'
import PublishAndTrack from './pages/PublishAndTrack'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 antialiased pt-24 pb-12">
      <GlassmorphismNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'content' && <ContentLibrary />}
        {activeTab === 'publish' && <PublishAndTrack />}
      </main>
    </div>
  )
}

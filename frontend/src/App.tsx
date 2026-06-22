import { useState } from 'react'

import NavTabs from './components/NavTabs'
import type { Tab } from './components/NavTabs'
import Dashboard from './pages/Dashboard'
import ContentLibrary from './pages/ContentLibrary'
import PublishAndTrack from './pages/PublishAndTrack'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  return (
    <>
      <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'content' && <ContentLibrary />}
      {activeTab === 'publish' && <PublishAndTrack />}
    </>
  )
}

type Tab = 'dashboard' | 'content' | 'publish'

type NavTabsProps = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export type { Tab }

export default function NavTabs({ activeTab, onTabChange }: NavTabsProps) {
  return (
    <nav className="nav-tabs">
      <div className="nav-tabs__inner">
        <button
          type="button"
          className={`nav-tab${activeTab === 'dashboard' ? ' nav-tab--active' : ''}`}
          onClick={() => onTabChange('dashboard')}
        >
          <span className="nav-tab__dot" />
          Dashboard
        </button>

        <button
          type="button"
          className={`nav-tab${activeTab === 'content' ? ' nav-tab--active' : ''}`}
          onClick={() => onTabChange('content')}
        >
          <span className="nav-tab__dot" />
          Content Library
        </button>

        <button
          type="button"
          className={`nav-tab${activeTab === 'publish' ? ' nav-tab--active' : ''}`}
          onClick={() => onTabChange('publish')}
        >
          <span className="nav-tab__dot" />
          Publish &amp; Track
        </button>
      </div>
    </nav>
  )
}

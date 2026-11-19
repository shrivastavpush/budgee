import { useNavigate } from 'react-router-dom'
import { SIDE_MENU_DATA } from '../../utils/data'

const DashboardDock = ({ activeMenu }) => {
  const navigate = useNavigate()
  const tabs = SIDE_MENU_DATA.filter((item) => item.path !== 'logout')

  return (
    <nav className="dashboard-dock" aria-label="Main navigation">
      {tabs.map((item) => {
        const isActive = activeMenu === item.label
        const Icon = item.icon

        return (
          <button
            type="button"
            key={item.id}
            className={`dashboard-dock-tab ${isActive ? 'is-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => navigate(item.path)}
          >
            <Icon aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default DashboardDock

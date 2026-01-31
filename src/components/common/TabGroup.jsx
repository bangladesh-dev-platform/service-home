/**
 * Reusable tab group component
 */
function TabGroup({ tabs, activeTab, onTabChange, className = '' }) {
  return (
    <div className={`flex space-x-2 bg-gray-100 rounded-lg p-1 text-sm ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 py-2 px-3 rounded-md transition-colors ${
              isActive
                ? 'bg-white text-green-600 shadow-sm font-medium'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.icon && <tab.icon className="h-4 w-4 inline mr-1" />}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default TabGroup

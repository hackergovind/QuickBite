import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaStore, FaMotorcycle, FaChartLine, FaSearch, FaCheck, FaTimes, FaUserShield } from 'react-icons/fa'
import { StatCard, BarChart } from '../components/AnalyticsChart.jsx'
import { useCatalog } from '../contexts/CatalogContext.jsx'

const MOCK_APPLICATIONS = [
  { id: 1, name: 'Taco Fiesta', owner: 'Carlos R.', type: 'Mexican', address: '124 Fiesta Blvd', status: 'pending' },
  { id: 2, name: 'Green Bowl', owner: 'Sarah W.', type: 'Healthy', address: '99 Wellness Way', status: 'pending' },
]

export default function AdminDashboard() {
  const { restaurants } = useCatalog()
  const [activeTab, setActiveTab] = useState('overview')
  const [applications, setApplications] = useState(MOCK_APPLICATIONS)

  const handleApprove = (id) => {
    setApplications(apps => apps.filter(a => a.id !== id))
    alert('Restaurant Approved and notified via email.')
  }

  const handleReject = (id) => {
    setApplications(apps => apps.filter(a => a.id !== id))
  }

  const navItems = [
    { id: 'overview', icon: <FaChartLine />, label: 'Overview' },
    { id: 'restaurants', icon: <FaStore />, label: 'Restaurants' },
    { id: 'users', icon: <FaUsers />, label: 'Users' },
    { id: 'riders', icon: <FaMotorcycle />, label: 'Riders' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex flex-col md:flex-row transition-colors">
      
      {/* Sidebar */}
      <div className="bg-dark-900 text-white w-full md:w-64 shrink-0 flex flex-col sticky top-0 md:h-screen z-20">
        <div className="p-6 border-b border-dark-800 flex items-center justify-between md:block">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
              <FaUserShield />
            </div>
            <span className="font-bold text-white tracking-wide">Admin Portal</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                  : 'text-gray-400 hover:bg-dark-800 hover:text-white'
              }`}
            >
              <span className={activeTab === item.id ? 'text-white' : 'opacity-70'}>{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
              {item.id === 'restaurants' && applications.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto md:block hidden">
                  {applications.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 max-h-screen overflow-y-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white capitalize">{activeTab}</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search anything..." className="pl-10 pr-4 py-2 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl focus:border-primary-500 outline-none text-sm text-dark-900 dark:text-white w-64" />
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full border-2 border-white dark:border-dark-800 shadow-sm" />
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Revenue" value="$42,890" icon="💵" color="green" trend={18} />
              <StatCard label="Active Users" value="12,450" icon={<FaUsers />} color="blue" trend={5} />
              <StatCard label="Total Orders" value="8,924" icon="🛍️" color="primary" trend={12} />
              <StatCard label="Restaurants" value={restaurants.length.toString()} icon={<FaStore />} color="orange" trend={2} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="section-card">
                <BarChart 
                  title="Revenue (Past 7 Days)" 
                  valuePrefix="$"
                  color="#10B981"
                  data={[
                    { label: 'Mon', value: 4500 },
                    { label: 'Tue', value: 5200 },
                    { label: 'Wed', value: 4800 },
                    { label: 'Thu', value: 6100 },
                    { label: 'Fri', value: 8900 },
                    { label: 'Sat', value: 11200 },
                    { label: 'Sun', value: 9800 },
                  ]}
                />
              </div>
              <div className="section-card">
                <BarChart 
                  title="Orders Volume"
                  color="#F97316"
                  data={[
                    { label: 'Mon', value: 320 },
                    { label: 'Tue', value: 380 },
                    { label: 'Wed', value: 350 },
                    { label: 'Thu', value: 420 },
                    { label: 'Fri', value: 650 },
                    { label: 'Sat', value: 810 },
                    { label: 'Sun', value: 720 },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Pending Approvals */}
            {applications.length > 0 && (
              <div className="section-card border-orange-200 dark:border-orange-900/30">
                <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping-slow" /> 
                  Pending Restaurant Approvals
                </h2>
                <div className="space-y-3">
                  {applications.map(app => (
                    <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700 gap-4">
                      <div>
                        <h3 className="font-bold text-dark-900 dark:text-white">{app.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Owner: {app.owner} • {app.type}</p>
                        <p className="text-xs text-gray-400 mt-1">{app.address}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleReject(app.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors tooltip-trigger relative group">
                          <FaTimes />
                        </button>
                        <button onClick={() => handleApprove(app.id)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                          <FaCheck /> Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="section-card">
              <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Active Restaurants</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-dark-800 rounded-t-xl">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-xl">Restaurant</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 rounded-tr-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map(r => (
                      <tr key={r.id} className="border-b border-gray-100 dark:border-dark-700 last:border-0 hover:bg-gray-50 dark:hover:bg-dark-800/50">
                        <td className="px-4 py-3 font-medium text-dark-900 dark:text-white flex items-center gap-3">
                          <img src={r.image} alt={r.name} className="w-8 h-8 rounded-lg object-cover" />
                          {r.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1"><FaStar className="text-yellow-400 text-xs" /> {r.rating}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-md text-xs font-semibold">Active</span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-primary-500 hover:underline">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'users' || activeTab === 'riders') && (
          <div className="text-center py-20 animate-fade-in section-card">
            <span className="text-5xl block mb-4">🚧</span>
            <h2 className="text-xl font-bold text-dark-900 dark:text-white">Under Construction</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Data grid for {activeTab} will be implemented in phase 3.</p>
          </div>
        )}

      </div>
    </div>
  )
}

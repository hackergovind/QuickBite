import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../contexts/AdminContext.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import {
  FaUsers, FaStore, FaShoppingBag, FaRupeeSign, FaBan, FaCheckCircle,
  FaTrash, FaEdit, FaSearch, FaBell, FaSignOutAlt,
  FaTachometerAlt, FaUtensils, FaClipboardList, FaCog, FaHistory,
  FaPlus, FaExclamationTriangle, FaLeaf, FaEye,
  FaArrowLeft, FaChartBar, FaLock, FaBars, FaTimes
} from 'react-icons/fa'

// ─── Confirm Modal ─────────────────────────────────────────────────────────
function ConfirmModal({ isOpen, title, message, danger = true, onConfirm, onCancel }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-100' : 'bg-green-100'}`}>
          <FaExclamationTriangle className={`text-2xl ${danger ? 'text-red-500' : 'text-green-500'}`} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>
        <p className="text-gray-500 text-center text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl font-bold text-white transition-colors ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>{danger ? 'Yes, Proceed' : 'Confirm'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, gradient }) {
  return (
    <div className={`rounded-2xl p-5 text-white ${gradient} shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <Icon className="text-xl" />
        </div>
        <span className="text-white/70 text-xs font-medium">{sub}</span>
      </div>
      <p className="text-3xl font-extrabold mb-1">{value}</p>
      <p className="text-white/80 text-sm font-medium">{label}</p>
    </div>
  )
}

// ─── Badge ─────────────────────────────────────────────────────────────────
function Badge({ label, color }) {
  const map = {
    admin:            'bg-purple-100 text-purple-700 border border-purple-200',
    owner:            'bg-orange-100 text-orange-700 border border-orange-200',
    customer:         'bg-blue-100 text-blue-700 border border-blue-200',
    active:           'bg-green-100 text-green-700 border border-green-200',
    banned:           'bg-red-100 text-red-700 border border-red-200',
    approved:         'bg-green-100 text-green-700 border border-green-200',
    pending:          'bg-amber-100 text-amber-700 border border-amber-200',
    suspended:        'bg-red-100 text-red-700 border border-red-200',
    delivered:        'bg-green-100 text-green-700 border border-green-200',
    cancelled:        'bg-red-100 text-red-700 border border-red-200',
    preparing:        'bg-orange-100 text-orange-700 border border-orange-200',
    confirmed:        'bg-blue-100 text-blue-700 border border-blue-200',
    out_for_delivery: 'bg-purple-100 text-purple-700 border border-purple-200',
    platform:         'bg-gray-100 text-gray-600 border border-gray-200',
  }
  const key = color || label?.toLowerCase().replace(/ /g, '_')
  const cls = map[key] || 'bg-gray-100 text-gray-600 border border-gray-200'
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cls} capitalize whitespace-nowrap`}>{label}</span>
  )
}

// ─── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
  )
}

// ─── Overview Panel ────────────────────────────────────────────────────────
function OverviewPanel() {
  const { analytics, allRestaurants, approveRestaurant, suspendRestaurant } = useAdmin()
  const [confirm, setConfirm] = useState(null)
  const pending = allRestaurants.filter(r => r.status === 'pending')

  return (
    <div className="space-y-8">
      <SectionHeader title="Dashboard Overview" subtitle="Your platform at a glance" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={FaUsers}       label="Total Users"      value={analytics.totalUsers}      sub={`${analytics.bannedUsers} banned`}          gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatCard icon={FaStore}       label="Restaurants"      value={analytics.totalRestaurants} sub={`${analytics.pendingRestaurants} pending`}    gradient="bg-gradient-to-br from-primary-500 to-orange-500" />
        <StatCard icon={FaShoppingBag} label="Active Orders"    value={analytics.activeOrders}     sub={`${analytics.totalOrders} total`}             gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
        <StatCard icon={FaRupeeSign}   label="Total Revenue"    value={`₹${analytics.totalRevenue.toFixed(0)}`} sub="delivered orders"               gradient="bg-gradient-to-br from-green-500 to-emerald-600" />
      </div>

      {/* Revenue by Restaurant */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
          <FaChartBar className="text-primary-500" /> Revenue by Restaurant
        </h3>
        {analytics.totalRevenue === 0 ? (
          <div className="text-center py-8">
            <FaChartBar className="text-4xl text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No revenue data yet. Revenue appears once orders are delivered.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allRestaurants.map(r => {
              const rev = analytics.recentOrders
                .filter(o => o.restaurantId === r.id && o.status === 'delivered')
                .reduce((s, o) => s + (o.total || 0), 0)
              if (!rev) return null
              return (
                <div key={r.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 truncate max-w-[200px]">{r.name}</span>
                    <span className="text-gray-900 font-bold">₹{rev.toFixed(0)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-primary-500 rounded-full" style={{ width: `${Math.min((rev / analytics.totalRevenue) * 100, 100)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pending Approvals */}
      {pending.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
          <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
            <FaBell className="text-amber-500" /> Pending Restaurant Approvals
            <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{pending.length}</span>
          </h3>
          <div className="space-y-3">
            {pending.map(r => (
              <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl shadow-sm">
                <div>
                  <p className="text-gray-900 font-semibold">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.cuisine} · {r.ownerName || 'Owner'}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setConfirm({ action: () => approveRestaurant(r.id), title: 'Approve Restaurant?', message: `Approve "${r.name}"?`, danger: false })}
                    className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors">
                    ✓ Approve
                  </button>
                  <button onClick={() => setConfirm({ action: () => suspendRestaurant(r.id), title: 'Reject?', message: `Reject "${r.name}"?`, danger: true })}
                    className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors">
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-gray-900 font-bold mb-4">Recent Orders</h3>
        {analytics.recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <FaShoppingBag className="text-4xl text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">
                {['Order ID','Customer','Restaurant','Total','Status'].map(h => (
                  <th key={h} className="pb-3 text-left text-gray-400 font-semibold pr-4 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {analytics.recentOrders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{o.id?.slice(0,12)}…</td>
                    <td className="py-3 pr-4 text-gray-900 font-medium">{o.customerName}</td>
                    <td className="py-3 pr-4 text-gray-600">{o.restaurantName}</td>
                    <td className="py-3 pr-4 text-primary-600 font-bold">₹{o.total?.toFixed(2)}</td>
                    <td className="py-3"><Badge label={o.status?.replace('_', ' ')} color={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal isOpen={!!confirm} title={confirm?.title} message={confirm?.message} danger={confirm?.danger}
        onConfirm={() => { confirm?.action(); setConfirm(null) }} onCancel={() => setConfirm(null)} />
    </div>
  )
}

// ─── Users Panel ───────────────────────────────────────────────────────────
function UsersPanel() {
  const { users, banUser, unbanUser, deleteUser, updateUserRole } = useAdmin()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [confirm, setConfirm] = useState(null)
  const [editUser, setEditUser] = useState(null)
  const PER = 10

  const filtered = useMemo(() => users.filter(u => {
    const q = search.toLowerCase()
    return (!q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
      && (roleFilter === 'all' || u.role === roleFilter)
      && (statusFilter === 'all' || (u.status || 'active') === statusFilter)
  }), [users, search, roleFilter, statusFilter])

  const pages = Math.max(1, Math.ceil(filtered.length / PER))
  const paginated = filtered.slice((page - 1) * PER, page * PER)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SectionHeader title="User Management" subtitle={`${filtered.length} users on the platform`} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search name or email…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 focus:border-primary-400 outline-none text-sm shadow-sm" />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm outline-none cursor-pointer shadow-sm">
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm outline-none cursor-pointer shadow-sm">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['User', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-gray-500 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-16 text-center text-gray-400">
                  <FaUsers className="text-4xl mx-auto mb-3 text-gray-200" />
                  No users found
                </td></tr>
              ) : paginated.map(u => (
                <tr key={u.id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name||'U')}&background=f97316&color=fff&size=36`}
                        alt="" className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-gray-900 font-medium whitespace-nowrap">{u.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-gray-500">{u.phone || '—'}</td>
                  <td className="px-4 py-3"><Badge label={u.role || 'customer'} color={u.role} /></td>
                  <td className="px-4 py-3"><Badge label={u.status || 'active'} color={u.status || 'active'} /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditUser(u)} title="Edit Role"
                        className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-primary-500 transition-colors"><FaEdit /></button>
                      {(u.status || 'active') === 'active' ? (
                        <button onClick={() => setConfirm({ action: () => banUser(u.id), title: 'Ban User?', message: `Ban "${u.name}"? They won't be able to log in.`, danger: true })}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><FaBan /></button>
                      ) : (
                        <button onClick={() => unbanUser(u.id)}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-500 transition-colors"><FaCheckCircle /></button>
                      )}
                      {u.id !== 'admin-001' && (
                        <button onClick={() => setConfirm({ action: () => deleteUser(u.id), title: 'Delete User?', message: `Permanently delete "${u.name}"?`, danger: true })}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><FaTrash /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex justify-center gap-2 py-4 border-t border-gray-100">
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${page === i + 1 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Edit Role Modal */}
      {editUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditUser(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-gray-900 font-bold text-lg mb-1">Change Role</h3>
            <p className="text-gray-500 text-sm mb-4">{editUser.name} · {editUser.email}</p>
            <div className="space-y-2 mb-6">
              {['customer', 'owner', 'admin'].map(r => (
                <button key={r} onClick={() => { updateUserRole(editUser.id, r); setEditUser(null) }}
                  className={`w-full py-2.5 rounded-xl font-semibold capitalize transition-colors border ${editUser.role === r ? 'bg-primary-500 border-primary-400 text-white' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-primary-300'}`}>
                  {r}
                </button>
              ))}
            </div>
            <button onClick={() => setEditUser(null)} className="w-full py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm">Cancel</button>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!confirm} title={confirm?.title} message={confirm?.message} danger={confirm?.danger}
        onConfirm={() => { confirm?.action(); setConfirm(null) }} onCancel={() => setConfirm(null)} />
    </div>
  )
}

// ─── Restaurants Panel ─────────────────────────────────────────────────────
function RestaurantsPanel() {
  const { allRestaurants, approveRestaurant, suspendRestaurant, deleteRestaurant } = useAdmin()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [confirm, setConfirm] = useState(null)

  const filtered = useMemo(() => allRestaurants.filter(r => {
    const q = search.toLowerCase()
    return (!q || r.name?.toLowerCase().includes(q) || r.cuisine?.toLowerCase().includes(q))
      && (statusFilter === 'all' || r.status === statusFilter)
  }), [allRestaurants, search, statusFilter])

  return (
    <div className="space-y-6">
      <SectionHeader title="Restaurant Management" subtitle={`${filtered.length} restaurants registered`} />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search restaurants…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 focus:border-primary-400 outline-none text-sm shadow-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm outline-none cursor-pointer shadow-sm">
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FaStore className="text-5xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold mb-1">No restaurants yet</p>
            <p className="text-gray-400 text-sm">Restaurant owners can create their listings from the Owner Dashboard.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Restaurant', 'Cuisine', 'Rating', 'Delivery', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-gray-500 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {r.image
                          ? <img src={r.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                          : <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center"><FaStore className="text-primary-500" /></div>
                        }
                        <div>
                          <p className="text-gray-900 font-semibold whitespace-nowrap">{r.name}</p>
                          <p className="text-gray-400 text-xs">{r.ownerName || 'Owner'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{r.cuisine}</td>
                    <td className="px-4 py-3 text-amber-500 font-bold">⭐ {r.rating || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.deliveryFee === 0 ? 'Free' : `₹${r.deliveryFee}`}</td>
                    <td className="px-4 py-3"><Badge label={r.status || 'pending'} color={r.status || 'pending'} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {r.status === 'pending' && (
                          <button onClick={() => setConfirm({ action: () => approveRestaurant(r.id), title: 'Approve?', message: `Approve "${r.name}"?`, danger: false })}
                            className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-500 transition-colors"><FaCheckCircle /></button>
                        )}
                        {r.status !== 'suspended' && (
                          <button onClick={() => setConfirm({ action: () => suspendRestaurant(r.id), title: 'Suspend?', message: `Suspend "${r.name}"?`, danger: true })}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><FaBan /></button>
                        )}
                        {r.status === 'suspended' && (
                          <button onClick={() => approveRestaurant(r.id)} title="Restore"
                            className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-500 transition-colors"><FaCheckCircle /></button>
                        )}
                        {r.isOwnerCreated && (
                          <button onClick={() => setConfirm({ action: () => deleteRestaurant(r.id), title: 'Delete Restaurant?', message: `Permanently delete "${r.name}"?`, danger: true })}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><FaTrash /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal isOpen={!!confirm} title={confirm?.title} message={confirm?.message} danger={confirm?.danger}
        onConfirm={() => { confirm?.action(); setConfirm(null) }} onCancel={() => setConfirm(null)} />
    </div>
  )
}

// ─── Menu Management Panel ─────────────────────────────────────────────────
function MenuPanel() {
  const { allRestaurants, allDishes, adminAddDish, adminUpdateDish, adminDeleteDish } = useAdmin()
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editDish, setEditDish] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', calories: '', category: 'other', isVeg: false, image: '' })

  const ownerRests = allRestaurants.filter(r => r.isOwnerCreated)
  const dishes = useMemo(() => {
    if (!selectedRestaurant) return []
    return allDishes.filter(d => d.restaurantId === selectedRestaurant.id && (!search || d.name?.toLowerCase().includes(search.toLowerCase())))
  }, [allDishes, selectedRestaurant, search])

  const handleSave = () => {
    if (!form.name || !form.price) return
    if (editDish) adminUpdateDish(selectedRestaurant.id, editDish.id, form)
    else adminAddDish(selectedRestaurant.id, form)
    setShowForm(false); setEditDish(null)
    setForm({ name: '', description: '', price: '', calories: '', category: 'other', isVeg: false, image: '' })
  }

  const openEdit = (d) => {
    setEditDish(d)
    setForm({ name: d.name, description: d.description || '', price: d.price, calories: d.calories || '', category: d.category || 'other', isVeg: !!d.isVeg, image: d.image || '' })
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Menu Management" subtitle="Override dishes for any restaurant" />

      {!selectedRestaurant ? (
        ownerRests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <FaUtensils className="text-5xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold mb-1">No restaurants yet</p>
            <p className="text-gray-400 text-sm">When owners create restaurants, you can manage their menus here.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownerRests.map(r => (
              <button key={r.id} onClick={() => setSelectedRestaurant(r)}
                className="bg-white border border-gray-100 hover:border-primary-300 hover:shadow-md rounded-2xl p-4 text-left transition-all group shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  {r.image ? <img src={r.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    : <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center"><FaStore className="text-primary-500" /></div>}
                  <div>
                    <p className="text-gray-900 font-bold group-hover:text-primary-600 transition-colors">{r.name}</p>
                    <Badge label={r.status || 'pending'} color={r.status || 'pending'} />
                  </div>
                </div>
                <p className="text-gray-400 text-xs">{(r.dishes || []).length} dishes</p>
              </button>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => { setSelectedRestaurant(null); setShowForm(false) }}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium">
              <FaArrowLeft /> Back
            </button>
            <h3 className="text-gray-900 font-bold text-lg">{selectedRestaurant.name}</h3>
            <Badge label={selectedRestaurant.status} color={selectedRestaurant.status} />
            <button onClick={() => { setEditDish(null); setForm({ name:'',description:'',price:'',calories:'',category:'other',isVeg:false,image:'' }); setShowForm(true) }}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm">
              <FaPlus /> Add Dish
            </button>
          </div>

          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dishes…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 focus:border-primary-400 outline-none text-sm shadow-sm" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['Dish','Category','Price','Calories','Type','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-gray-500 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dishes.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No dishes yet. Add one above.</td></tr>
                  ) : dishes.map(d => (
                    <tr key={d.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {d.image ? <img src={d.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                            : <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center"><FaUtensils className="text-primary-400" /></div>}
                          <div>
                            <p className="text-gray-900 font-medium">{d.name}</p>
                            <p className="text-gray-400 text-xs line-clamp-1">{d.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{d.category}</td>
                      <td className="px-4 py-3 text-primary-600 font-bold">₹{Number(d.price).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-500">{d.calories || '—'} cal</td>
                      <td className="px-4 py-3">
                        {d.isVeg
                          ? <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><FaLeaf /> Veg</span>
                          : <span className="text-red-500 text-xs font-bold">Non-Veg</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-primary-500 transition-colors"><FaEdit /></button>
                          <button onClick={() => setConfirm({ action: () => adminDeleteDish(selectedRestaurant.id, d.id), title: 'Delete Dish?', message: `Delete "${d.name}"?`, danger: true })}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dish Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-gray-900 font-bold text-lg mb-4">{editDish ? 'Edit Dish' : 'Add New Dish'}</h3>
            <div className="space-y-4">
              {[
                { label: 'Dish Name *', key: 'name', type: 'text', ph: 'e.g. Butter Chicken' },
                { label: 'Description', key: 'description', type: 'text', ph: 'Short description' },
                { label: 'Price (₹) *', key: 'price', type: 'number', ph: '12.99' },
                { label: 'Calories', key: 'calories', type: 'number', ph: '450' },
                { label: 'Image URL', key: 'image', type: 'text', ph: 'https://…' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-gray-600 font-medium mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:border-primary-400 outline-none text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:border-primary-400 outline-none text-sm cursor-pointer">
                  {['burger','pizza','sushi','indian','dessert','healthy','chinese','mexican','italian','other'].map(c => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setForm(p => ({ ...p, isVeg: !p.isVeg }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.isVeg ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isVeg ? 'left-7' : 'left-1'}`} />
                </div>
                <span className={`text-sm font-medium ${form.isVeg ? 'text-green-600' : 'text-gray-500'}`}>
                  {form.isVeg ? '🌿 Vegetarian' : '🍖 Non-Vegetarian'}
                </span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-colors shadow-sm">
                {editDish ? 'Save Changes' : 'Add Dish'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!confirm} title={confirm?.title} message={confirm?.message} danger={confirm?.danger}
        onConfirm={() => { confirm?.action(); setConfirm(null) }} onCancel={() => setConfirm(null)} />
    </div>
  )
}

// ─── Orders Panel ──────────────────────────────────────────────────────────
function OrdersPanel() {
  const { orders, adminUpdateOrderStatus } = useAdmin()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => [...orders]
    .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
    .filter(o => {
      const q = search.toLowerCase()
      return (!q || o.customerName?.toLowerCase().includes(q) || o.restaurantName?.toLowerCase().includes(q))
        && (statusFilter === 'all' || o.status === statusFilter)
    }), [orders, search, statusFilter])

  const STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']

  return (
    <div className="space-y-6">
      <SectionHeader title="Order Management" subtitle={`${filtered.length} orders`} />
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer or restaurant…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 focus:border-primary-400 outline-none text-sm shadow-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm outline-none cursor-pointer shadow-sm">
          <option value="all">All Status</option>
          {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FaShoppingBag className="text-5xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold mb-1">No orders yet</p>
            <p className="text-gray-400 text-sm">Orders appear here after customers place them.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Order ID', 'Customer', 'Restaurant', 'Items', 'Total', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-gray-500 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{o.id?.slice(0, 14)}…</td>
                    <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">{o.customerName}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{o.restaurantName}</td>
                    <td className="px-4 py-3 text-gray-500">{o.items?.length || 0} items</td>
                    <td className="px-4 py-3 text-primary-600 font-bold">₹{o.total?.toFixed(2)}</td>
                    <td className="px-4 py-3"><Badge label={o.status?.replace('_', ' ')} color={o.status} /></td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {o.placedAt ? new Date(o.placedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <select value={o.status} onChange={e => adminUpdateOrderStatus(o.id, e.target.value)}
                        className="px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-xs outline-none cursor-pointer">
                        {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Activity Panel ────────────────────────────────────────────────────────
function ActivityPanel() {
  const { activityLog } = useAdmin()
  return (
    <div className="space-y-6">
      <SectionHeader title="Activity Log" subtitle={`Last ${activityLog.length} admin actions`} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        {activityLog.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FaHistory className="text-5xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">No activity yet. Actions you perform will be logged here.</p>
          </div>
        ) : activityLog.map(entry => (
          <div key={entry.id} className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-orange-50/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
              <p className="text-gray-600 text-sm">{entry.msg}</p>
            </div>
            <span className="text-gray-400 text-xs whitespace-nowrap">{new Date(entry.time).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Settings Panel ────────────────────────────────────────────────────────
function SettingsPanel() {
  const { settings, updateSettings, announcement, setAnnouncement } = useAdmin()
  const [local, setLocal] = useState(settings)
  const [localAnn, setLocalAnn] = useState(announcement)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateSettings(local)
    setAnnouncement(localAnn)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader title="Platform Settings" subtitle="Configure global platform options" />
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
          <input value={local.platformName} onChange={e => setLocal(p => ({ ...p, platformName: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:border-primary-400 outline-none text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
          <input type="number" value={local.commission} onChange={e => setLocal(p => ({ ...p, commission: Number(e.target.value) }))}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:border-primary-400 outline-none text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site-wide Announcement</label>
          <textarea value={localAnn} onChange={e => setLocalAnn(e.target.value)} rows={3} placeholder="Leave blank to hide. e.g. 🎉 50% off this weekend!"
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:border-primary-400 outline-none resize-none text-sm" />
        </div>
        <button onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all shadow-sm ${saved ? 'bg-green-500' : 'bg-primary-500 hover:bg-primary-600'}`}>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

// ─── Sidebar Nav ───────────────────────────────────────────────────────────
const NAV = [
  { key: 'overview',    label: 'Overview',    icon: FaTachometerAlt },
  { key: 'users',       label: 'Users',        icon: FaUsers },
  { key: 'restaurants', label: 'Restaurants',  icon: FaStore },
  { key: 'menu',        label: 'Menu Control', icon: FaUtensils },
  { key: 'orders',      label: 'Orders',       icon: FaShoppingBag },
  { key: 'activity',    label: 'Activity Log', icon: FaHistory },
  { key: 'settings',    label: 'Settings',     icon: FaCog },
]

// ─── Main Admin Dashboard ──────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const { analytics, announcement } = useAdmin()
  const navigate = useNavigate()
  const [activePanel, setActivePanel] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const PANELS = {
    overview:    <OverviewPanel />,
    users:       <UsersPanel />,
    restaurants: <RestaurantsPanel />,
    menu:        <MenuPanel />,
    orders:      <OrdersPanel />,
    activity:    <ActivityPanel />,
    settings:    <SettingsPanel />,
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col shadow-lg lg:shadow-sm transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-md shadow-primary-200">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <div>
              <p className="text-gray-900 font-bold text-sm leading-tight">QuickBite</p>
              <p className="text-primary-500 text-xs font-semibold">Super Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => { setActivePanel(key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activePanel === key
                  ? 'bg-primary-50 text-primary-600 border border-primary-100 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}>
              <Icon className={`text-base shrink-0 ${activePanel === key ? 'text-primary-500' : ''}`} />
              {label}
              {key === 'restaurants' && analytics.pendingRestaurants > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{analytics.pendingRestaurants}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=Admin&background=f97316&color=fff&size=40`}
              alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-100" />
            <div className="overflow-hidden">
              <p className="text-gray-900 text-sm font-semibold truncate">{user?.name || 'Admin'}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login') }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 border border-gray-100 hover:border-red-100 transition-all text-sm font-medium">
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 gap-4 shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
            <FaBars />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-gray-900 font-bold capitalize">{NAV.find(n => n.key === activePanel)?.label}</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {announcement && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-100 rounded-xl text-primary-600 text-xs font-medium">
                <FaBell className="text-primary-500" /> {announcement.slice(0, 50)}{announcement.length > 50 ? '…' : ''}
              </div>
            )}
            <button onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-primary-600 border border-gray-100 hover:border-primary-100 transition-all text-sm font-medium">
              <FaEye /> View Site
            </button>
          </div>
        </header>

        {/* Panel */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {announcement && (
            <div className="mb-6 px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl text-primary-700 text-sm font-medium">
              📢 {announcement}
            </div>
          )}
          {PANELS[activePanel]}
        </main>
      </div>
    </div>
  )
}

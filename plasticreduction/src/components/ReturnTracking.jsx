import { useState } from 'react'
import {
  QrCode, Package, RefreshCw, MapPin, Users, Award,
  TrendingUp, CheckCircle, Clock, AlertTriangle, Search,
  ChevronRight, Star, Truck
} from 'lucide-react'

// Mock data for bottle tracking
const bottleDatabase = {
  'BTL-5G-001234': { type: '5 Gallon', cycles: 47, lastReturn: '2024-10-28', customer: 'Al Maha Trading', location: 'Muscat', status: 'active', condition: 'good' },
  'BTL-5G-001235': { type: '5 Gallon', cycles: 32, lastReturn: '2024-10-25', customer: 'Oman Hotels', location: 'Salalah', status: 'active', condition: 'good' },
  'BTL-5G-001236': { type: '5 Gallon', cycles: 61, lastReturn: '2024-10-15', customer: 'Gulf Enterprises', location: 'Sohar', status: 'inspection', condition: 'worn' },
  'BTL-4G-002345': { type: '4 Gallon', cycles: 28, lastReturn: '2024-10-27', customer: 'Royal Oman Police', location: 'Muscat', status: 'active', condition: 'good' },
  'BTL-4G-002346': { type: '4 Gallon', cycles: 55, lastReturn: '2024-10-20', customer: 'PDO', location: 'Nizwa', status: 'retired', condition: 'damaged' },
}

const customers = [
  { id: 1, name: 'Al Maha Trading', location: 'Muscat', bottlesOut: 450, returnRate: 92, points: 4500, tier: 'Gold' },
  { id: 2, name: 'Oman Hotels Group', location: 'Salalah', bottlesOut: 320, returnRate: 88, points: 3200, tier: 'Silver' },
  { id: 3, name: 'Gulf Enterprises', location: 'Sohar', bottlesOut: 280, returnRate: 95, points: 5600, tier: 'Platinum' },
  { id: 4, name: 'Royal Oman Police', location: 'Muscat', bottlesOut: 520, returnRate: 85, points: 2600, tier: 'Silver' },
  { id: 5, name: 'PDO - Petroleum Dev', location: 'Nizwa', bottlesOut: 680, returnRate: 78, points: 1900, tier: 'Bronze' },
  { id: 6, name: 'Ministry of Education', location: 'Muscat', bottlesOut: 890, returnRate: 91, points: 4450, tier: 'Gold' },
]

const regionStats = [
  { region: 'Muscat', bottles: 45000, returnRate: 89, customers: 234 },
  { region: 'Salalah', bottles: 12000, returnRate: 82, customers: 78 },
  { region: 'Sohar', bottles: 8500, returnRate: 91, customers: 45 },
  { region: 'Nizwa', bottles: 6200, returnRate: 76, customers: 32 },
  { region: 'Sur', bottles: 4800, returnRate: 84, customers: 28 },
]

const recentReturns = [
  { id: 1, bottleId: 'BTL-5G-001234', customer: 'Al Maha Trading', time: '10 min ago', condition: 'Good' },
  { id: 2, bottleId: 'BTL-4G-002345', customer: 'Royal Oman Police', time: '25 min ago', condition: 'Good' },
  { id: 3, bottleId: 'BTL-5G-001235', customer: 'Oman Hotels', time: '1 hour ago', condition: 'Good' },
  { id: 4, bottleId: 'BTL-5G-001236', customer: 'Gulf Enterprises', time: '2 hours ago', condition: 'Worn - Inspection' },
  { id: 5, bottleId: 'BTL-4G-002346', customer: 'PDO', time: '3 hours ago', condition: 'Damaged - Retired' },
]

export default function ReturnTracking() {
  const [scanInput, setScanInput] = useState('')
  const [scannedBottle, setScannedBottle] = useState(null)
  const [scanError, setScanError] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const handleScan = () => {
    const bottle = bottleDatabase[scanInput.toUpperCase()]
    if (bottle) {
      setScannedBottle({ id: scanInput.toUpperCase(), ...bottle })
      setScanError(null)
    } else {
      setScanError('Bottle not found. Try: BTL-5G-001234')
      setScannedBottle(null)
    }
  }

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Platinum': return 'text-cyan-400 bg-cyan-500/20'
      case 'Gold': return 'text-yellow-400 bg-yellow-500/20'
      case 'Silver': return 'text-gray-300 bg-gray-500/20'
      default: return 'text-amber-600 bg-amber-500/20'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20'
      case 'inspection': return 'text-yellow-400 bg-yellow-500/20'
      case 'retired': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">76,500</p>
              <p className="text-xs text-gray-400">Active Bottles</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <RefreshCw className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">86.4%</p>
              <p className="text-xs text-gray-400">Avg Return Rate</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">417</p>
              <p className="text-xs text-gray-400">Active Customers</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">22,250</p>
              <p className="text-xs text-gray-400">Loyalty Points Issued</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-400" />
            Bottle Scanner
          </h3>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                  placeholder="Enter bottle ID (e.g., BTL-5G-001234)"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleScan}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
              >
                Scan
              </button>
            </div>

            {scanError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                {scanError}
              </div>
            )}

            {scannedBottle && (
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">{scannedBottle.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scannedBottle.status)}`}>
                    {scannedBottle.status.charAt(0).toUpperCase() + scannedBottle.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="text-white">{scannedBottle.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Lifecycle Cycles</p>
                    <p className="text-green-400 font-semibold">{scannedBottle.cycles}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Customer</p>
                    <p className="text-white">{scannedBottle.customer}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="text-white">{scannedBottle.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Return</p>
                    <p className="text-white">{scannedBottle.lastReturn}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Condition</p>
                    <p className={scannedBottle.condition === 'good' ? 'text-green-400' : 'text-yellow-400'}>
                      {scannedBottle.condition.charAt(0).toUpperCase() + scannedBottle.condition.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-700/50">
                  <p className="text-xs text-gray-500 mb-2">Plastic Saved (vs single-use)</p>
                  <p className="text-xl font-bold text-green-400">
                    {(scannedBottle.cycles * (scannedBottle.type === '5 Gallon' ? 0.75 : 0.58)).toFixed(1)} kg
                  </p>
                </div>
              </div>
            )}

            {!scannedBottle && !scanError && (
              <div className="text-center py-8 text-gray-500">
                <QrCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Scan a bottle QR code or enter ID manually</p>
                <p className="text-xs mt-1">Try: BTL-5G-001234, BTL-4G-002345</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Returns */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-400" />
            Recent Returns
          </h3>
          <div className="space-y-3">
            {recentReturns.map(ret => (
              <div key={ret.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    ret.condition === 'Good' ? 'bg-green-400' :
                    ret.condition.includes('Worn') ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <p className="text-white text-sm font-medium">{ret.bottleId}</p>
                    <p className="text-gray-500 text-xs">{ret.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">{ret.time}</p>
                  <p className={`text-xs ${
                    ret.condition === 'Good' ? 'text-green-400' :
                    ret.condition.includes('Worn') ? 'text-yellow-400' : 'text-red-400'
                  }`}>{ret.condition}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Loyalty Program */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Customer Loyalty Program
          </h3>
          <div className="flex gap-2">
            {['Platinum', 'Gold', 'Silver', 'Bronze'].map(tier => (
              <span key={tier} className={`px-2 py-1 rounded text-xs ${getTierColor(tier)}`}>
                {tier}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-500 text-xs border-b border-gray-700/50">
                <th className="text-left py-3 px-2">Customer</th>
                <th className="text-left py-3 px-2">Location</th>
                <th className="text-right py-3 px-2">Bottles Out</th>
                <th className="text-right py-3 px-2">Return Rate</th>
                <th className="text-right py-3 px-2">Points</th>
                <th className="text-center py-3 px-2">Tier</th>
                <th className="text-right py-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors cursor-pointer"
                  onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                >
                  <td className="py-3 px-2">
                    <p className="text-white text-sm font-medium">{customer.name}</p>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <MapPin className="w-3 h-3" />
                      {customer.location}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right text-white text-sm">{customer.bottlesOut}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-sm font-medium ${
                      customer.returnRate >= 90 ? 'text-green-400' :
                      customer.returnRate >= 80 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {customer.returnRate}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right text-amber-400 text-sm font-medium">
                    {customer.points.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${getTierColor(customer.tier)}`}>
                      {customer.tier}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${
                      selectedCustomer === customer.id ? 'rotate-90' : ''
                    }`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loyalty Tiers Info */}
        <div className="mt-4 pt-4 border-t border-gray-700/50 grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <p className="text-cyan-400 font-bold">Platinum</p>
            <p className="text-xs text-gray-400 mt-1">95%+ return rate</p>
            <p className="text-xs text-cyan-300 mt-1">10 pts/bottle</p>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <p className="text-yellow-400 font-bold">Gold</p>
            <p className="text-xs text-gray-400 mt-1">90-94% return rate</p>
            <p className="text-xs text-yellow-300 mt-1">7 pts/bottle</p>
          </div>
          <div className="p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
            <p className="text-gray-300 font-bold">Silver</p>
            <p className="text-xs text-gray-400 mt-1">80-89% return rate</p>
            <p className="text-xs text-gray-300 mt-1">5 pts/bottle</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <p className="text-amber-600 font-bold">Bronze</p>
            <p className="text-xs text-gray-400 mt-1">&lt;80% return rate</p>
            <p className="text-xs text-amber-400 mt-1">3 pts/bottle</p>
          </div>
        </div>
      </div>

      {/* Regional Performance */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          Regional Return Performance
        </h3>
        <div className="grid md:grid-cols-5 gap-4">
          {regionStats.map(region => (
            <div key={region.region} className="bg-gray-900/50 rounded-lg p-4">
              <p className="text-white font-medium mb-2">{region.region}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Bottles</span>
                  <span className="text-blue-400">{(region.bottles / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Return Rate</span>
                  <span className={region.returnRate >= 85 ? 'text-green-400' : region.returnRate >= 80 ? 'text-yellow-400' : 'text-red-400'}>
                    {region.returnRate}%
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      region.returnRate >= 85 ? 'bg-green-500' :
                      region.returnRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${region.returnRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Customers</span>
                  <span className="text-gray-400">{region.customers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

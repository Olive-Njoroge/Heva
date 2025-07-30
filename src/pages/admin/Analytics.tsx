import React, { useState } from 'react';
import { CalendarDays, Download, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Layout } from '../../components/shared/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

// Mock data for analytics
const monthlyTrends = [
  { month: 'Jan', applications: 89, approvals: 73, revenue: 245000 },
  { month: 'Feb', applications: 95, approvals: 76, revenue: 267000 },
  { month: 'Mar', applications: 112, approvals: 87, revenue: 298000 },
  { month: 'Apr', applications: 108, approvals: 84, revenue: 285000 },
  { month: 'May', applications: 134, approvals: 104, revenue: 356000 },
  { month: 'Jun', applications: 142, approvals: 111, revenue: 378000 },
];

const sectorPerformance = [
  { sector: 'Fashion', applications: 342, avgScore: 721, approvalRate: 82 },
  { sector: 'Film', applications: 298, avgScore: 698, approvalRate: 71 },
  { sector: 'Music', applications: 256, avgScore: 735, approvalRate: 85 },
  { sector: 'Digital', applications: 189, avgScore: 758, approvalRate: 89 },
  { sector: 'Art', applications: 167, avgScore: 689, approvalRate: 76 },
  { sector: 'Performing', applications: 145, avgScore: 672, approvalRate: 68 },
];

const riskAnalysis = [
  { range: '300-500', count: 23, color: '#EF4444' },
  { range: '501-650', count: 156, color: '#F59E0B' },
  { range: '651-750', count: 487, color: '#10B981' },
  { range: '751-850', count: 298, color: '#3B82F6' },
];

const portfolioHealth = [
  { month: 'Jan', healthy: 85, warning: 12, critical: 3 },
  { month: 'Feb', healthy: 87, warning: 10, critical: 3 },
  { month: 'Mar', healthy: 89, warning: 9, critical: 2 },
  { month: 'Apr', healthy: 91, warning: 7, critical: 2 },
  { month: 'May', healthy: 88, warning: 10, critical: 2 },
  { month: 'Jun', healthy: 92, warning: 6, critical: 2 },
];

export function Analytics() {
  const [dateRange, setDateRange] = useState('6months');

  const exportChart = (chartName: string) => {
    // Mock export functionality
    console.log(`Exporting ${chartName} chart`);
  };

  return (
    <Layout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Advanced insights and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            
            <Button variant="outline">
              <Download size={16} className="mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">$2.4M</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +18% vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">724</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +5% vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Default Rate</p>
                <p className="text-2xl font-bold text-gray-900">2.1%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  -0.3% vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-red-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                <p className="text-2xl font-bold text-gray-900">23%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" />
                  +7% vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
              <Button variant="ghost" size="sm" onClick={() => exportChart('monthly-trends')}>
                <Download size={14} />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} name="Applications" />
                <Line type="monotone" dataKey="approvals" stroke="#10B981" strokeWidth={2} name="Approvals" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Sector Performance */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sector Performance</h3>
              <Button variant="ghost" size="sm" onClick={() => exportChart('sector-performance')}>
                <Download size={14} />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Distribution */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Credit Score Distribution</h3>
              <Button variant="ghost" size="sm" onClick={() => exportChart('risk-distribution')}>
                <Download size={14} />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskAnalysis}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percent }) => `${range} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {riskAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Portfolio Health */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Health Trends</h3>
              <Button variant="ghost" size="sm" onClick={() => exportChart('portfolio-health')}>
                <Download size={14} />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={portfolioHealth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="healthy" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Healthy" />
                <Area type="monotone" dataKey="warning" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Warning" />
                <Area type="monotone" dataKey="critical" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Critical" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detailed Analysis Table */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sector Analysis</h3>
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Export Table
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Sector</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Applications</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Approval Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {sectorPerformance.map((sector) => (
                  <tr key={sector.sector} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{sector.sector}</td>
                    <td className="py-3 px-4 text-gray-700">{sector.applications}</td>
                    <td className="py-3 px-4 text-gray-700">{sector.avgScore}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sector.approvalRate >= 80 
                          ? 'bg-green-100 text-green-800'
                          : sector.approvalRate >= 70
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sector.approvalRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-green-600">
                        <TrendingUp size={16} className="mr-1" />
                        <span className="text-sm">+{Math.floor(Math.random() * 10) + 1}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
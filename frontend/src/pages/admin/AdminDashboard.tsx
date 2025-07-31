import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Layout } from '../../components/shared/Layout';
import { KPICard } from '../../components/admin/KPICard';
import { ApplicationCard } from '../../components/admin/ApplicationCard';
import { ApplicationDetailsModal } from '../../components/admin/ApplicationDetailsModal';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  mockKPIs, 
  mockApplications, 
  applicationTrendsData, 
  approvalRatesBySector, 
  riskDistributionData, 
  geographicData 
} from '../../data/mockData';
import { Application } from '../../types';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export function AdminDashboard() {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applications, setApplications] = useState(mockApplications);

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
  };

  const handleApprove = (id: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, status: 'approved' as const, reviewDate: new Date().toISOString().split('T')[0] }
          : app
      )
    );
  };

  const handleReject = (id: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, status: 'rejected' as const, reviewDate: new Date().toISOString().split('T')[0] }
          : app
      )
    );
  };

  const recentApplications = applications.slice(0, 3);

  return (
    <Layout isAdmin>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of HEVA credit scoring platform</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {mockKPIs.map((kpi, index) => (
            <KPICard key={kpi.label} kpi={kpi} index={index} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Trends */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Approval Rates by Sector */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Rates by Sector</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={approvalRatesBySector}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Approval Rate']} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={geographicData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <Button variant="outline" size="sm">
              View All Applications
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onViewDetails={handleViewDetails}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        </Card>

        {/* Application Details Modal */}
        <ApplicationDetailsModal
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </Layout>
  );
}
import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Layout } from '../../components/shared/Layout';
import { ApplicationCard } from '../../components/admin/ApplicationCard';
import { ApplicationDetailsModal } from '../../components/admin/ApplicationDetailsModal';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockApplications } from '../../data/mockData';
import { Application } from '../../types';

export function Applications() {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

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

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || app.industry === industryFilter;
    
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const industries = [...new Set(applications.map(app => app.industry))];

  return (
    <Layout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600">Manage credit applications</p>
          </div>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Industry Filter */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            <Button variant="outline">
              <Filter size={16} className="mr-2" />
              More Filters
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {applications.filter(app => app.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </Card>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">No applications found matching your criteria.</p>
            </div>
          </Card>
        )}

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
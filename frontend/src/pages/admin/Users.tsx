import React, { useState } from 'react';
import { Search, Filter, Mail, MoreVertical, User as UserIcon } from 'lucide-react';
import { Layout } from '../../components/shared/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { mockUsers } from '../../data/mockData';
import { User } from '../../types';

export function Users() {
  const [users] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.businessName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || user.industry === industryFilter;
    
    return matchesSearch && matchesIndustry;
  });

  const industries = [...new Set(users.map(user => user.industry).filter(Boolean))];

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600">Manage creative professionals</p>
          </div>
          <Button variant="primary">
            Add New User
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
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

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
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(user => user.applicationStatus === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {users.filter(user => user.applicationStatus === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(users.reduce((sum, user) => sum + (user.creditScore || 0), 0) / users.length)}
              </div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
          </Card>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {user.businessName && (
                  <div>
                    <p className="text-sm text-gray-600">Business</p>
                    <p className="font-medium text-gray-900">{user.businessName}</p>
                  </div>
                )}

                {user.industry && (
                  <div>
                    <p className="text-sm text-gray-600">Industry</p>
                    <p className="font-medium text-gray-900">{user.industry}</p>
                  </div>
                )}

                {user.creditScore && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Credit Score</p>
                    <p className={`text-lg font-bold ${getScoreColor(user.creditScore)}`}>
                      {user.creditScore}
                    </p>
                  </div>
                )}

                {user.applicationStatus && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.applicationStatus)}`}>
                      {user.applicationStatus}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                  {user.lastActivity && (
                    <span>Active {new Date(user.lastActivity).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedUser(user)}
                  className="flex-1"
                >
                  View Profile
                </Button>
                <Button size="sm" variant="ghost">
                  <Mail size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          </Card>
        )}

        {/* User Details Modal */}
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="User Profile"
          size="lg"
        >
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon size={24} className="text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h2>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  {selectedUser.businessName && (
                    <p className="text-sm text-gray-500">{selectedUser.businessName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="text-gray-900">{selectedUser.industry || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="text-gray-900">{selectedUser.location || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Years in Business:</span>
                      <span className="text-gray-900">{selectedUser.yearsInBusiness || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Account Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Score:</span>
                      <span className={`font-bold ${getScoreColor(selectedUser.creditScore)}`}>
                        {selectedUser.creditScore || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Application Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.applicationStatus)}`}>
                        {selectedUser.applicationStatus || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="text-gray-900">{new Date(selectedUser.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <Button variant="primary" className="flex-1">
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1">
                  View Application
                </Button>
                <Button variant="ghost">
                  More Actions
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}
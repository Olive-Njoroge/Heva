import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, Clock, CheckCircle, Eye } from 'lucide-react';
import { Layout } from '../../components/shared/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { mockRiskAlerts } from '../../data/mockData';
import { RiskAlert } from '../../types';

export function RiskManagement() {
  const [alerts, setAlerts] = useState(mockRiskAlerts);
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
    setSelectedAlert(null);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unresolved') return !alert.resolved;
    if (filter === 'resolved') return alert.resolved;
    return alert.severity === filter;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'medium':
        return <TrendingDown size={16} className="text-yellow-500" />;
      case 'low':
        return <Clock size={16} className="text-blue-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'payment_delay':
        return 'Payment Delay';
      case 'income_drop':
        return 'Income Drop';
      case 'industry_risk':
        return 'Industry Risk';
      case 'document_issue':
        return 'Document Issue';
      default:
        return 'Unknown';
    }
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);
  const highPriorityAlerts = unresolvedAlerts.filter(alert => alert.severity === 'high');

  return (
    <Layout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Risk Management</h1>
            <p className="text-gray-600">Monitor and manage portfolio risks</p>
          </div>
          <Button variant="outline">
            Generate Risk Report
          </Button>
        </div>

        {/* Risk Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityAlerts.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingDown size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-yellow-600">{unresolvedAlerts.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">3</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio Health</p>
                <p className="text-2xl font-bold text-blue-600">92%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Alerts ({alerts.length})
            </Button>
            <Button
              variant={filter === 'unresolved' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('unresolved')}
            >
              Unresolved ({unresolvedAlerts.length})
            </Button>
            <Button
              variant={filter === 'high' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
            >
              High Priority ({alerts.filter(a => a.severity === 'high').length})
            </Button>
            <Button
              variant={filter === 'medium' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('medium')}
            >
              Medium Priority ({alerts.filter(a => a.severity === 'medium').length})
            </Button>
            <Button
              variant={filter === 'low' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('low')}
            >
              Low Priority ({alerts.filter(a => a.severity === 'low').length})
            </Button>
          </div>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id} hover className={alert.resolved ? 'opacity-60' : ''}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">{getAlertTypeLabel(alert.type)}</span>
                      {alert.resolved && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          RESOLVED
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{alert.userName}</h3>
                    <p className="text-gray-700 mb-2">{alert.message}</p>
                    <p className="text-xs text-gray-500">
                      Alert generated on {new Date(alert.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    View Details
                  </Button>
                  {!alert.resolved && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleResolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">No alerts found matching your criteria.</p>
            </div>
          </Card>
        )}

        {/* Alert Details Modal */}
        <Modal
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title="Alert Details"
          size="lg"
        >
          {selectedAlert && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                {getSeverityIcon(selectedAlert.severity)}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{getAlertTypeLabel(selectedAlert.type)}</h2>
                  <p className="text-gray-600">{selectedAlert.userName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(selectedAlert.severity)}`}>
                  {selectedAlert.severity.toUpperCase()} PRIORITY
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Alert Description</h3>
                <p className="text-gray-700">{selectedAlert.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Alert Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="text-gray-900">{getAlertTypeLabel(selectedAlert.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Severity:</span>
                      <span className="text-gray-900">{selectedAlert.severity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">{new Date(selectedAlert.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={selectedAlert.resolved ? 'text-green-600' : 'text-red-600'}>
                        {selectedAlert.resolved ? 'Resolved' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Recommended Actions</h3>
                  <div className="space-y-2 text-sm">
                    {selectedAlert.type === 'payment_delay' && (
                      <>
                        <p className="text-gray-700">• Contact user immediately</p>
                        <p className="text-gray-700">• Review payment history</p>
                        <p className="text-gray-700">• Consider credit limit adjustment</p>
                        <p className="text-gray-700">• Schedule follow-up review</p>
                      </>
                    )}
                    {selectedAlert.type === 'income_drop' && (
                      <>
                        <p className="text-gray-700">• Analyze revenue trends</p>
                        <p className="text-gray-700">• Request updated financials</p>
                        <p className="text-gray-700">• Consider risk reassessment</p>
                        <p className="text-gray-700">• Monitor for recovery</p>
                      </>
                    )}
                    {selectedAlert.type === 'industry_risk' && (
                      <>
                        <p className="text-gray-700">• Monitor sector trends</p>
                        <p className="text-gray-700">• Review portfolio exposure</p>
                        <p className="text-gray-700">• Consider diversification</p>
                        <p className="text-gray-700">• Update risk models</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Risk Impact Assessment</h3>
                <p className="text-yellow-700 text-sm">
                  This alert affects 1 user and represents approximately $45,000 in portfolio exposure. 
                  Immediate action recommended to prevent escalation.
                </p>
              </div>

              {!selectedAlert.resolved && (
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={() => handleResolveAlert(selectedAlert.id)}
                    className="flex-1"
                  >
                    Mark as Resolved
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Escalate Alert
                  </Button>
                  <Button variant="ghost">
                    Add Note
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}
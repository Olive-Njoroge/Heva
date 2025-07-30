import { FileText, DollarSign, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { Application } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ApplicationDetailsModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApplicationDetailsModal({ 
  application, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject 
}: ApplicationDetailsModalProps) {
  if (!application) return null;

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = () => {
    switch (application.riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application Details"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{application.applicantName}</h2>
            <p className="text-gray-600">{application.businessName}</p>
            <p className="text-sm text-gray-500">{application.industry}</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(application.creditScore)}`}>
              {application.creditScore}
            </div>
            <p className="text-sm text-gray-500">Credit Score</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Requested</span>
            </div>
            <p className="text-lg font-semibold">${application.requestedAmount.toLocaleString()}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign size={20} className="text-green-600" />
              <span className="text-sm font-medium text-gray-600">Monthly Revenue</span>
            </div>
            <p className="text-lg font-semibold">${application.monthlyRevenue.toLocaleString()}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar size={20} className="text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Submitted</span>
            </div>
            <p className="text-lg font-semibold">{new Date(application.submissionDate).toLocaleDateString()}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle size={20} className="text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Risk Level</span>
            </div>
            <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getRiskColor()}`}>
              {application.riskLevel}
            </span>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Documents</h3>
          {application.documents.length > 0 ? (
            <div className="space-y-2">
              {application.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.category} • {doc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.status === 'verified' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <AlertTriangle size={16} className="text-yellow-500" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      doc.status === 'verified' 
                        ? 'bg-green-100 text-green-800'
                        : doc.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No documents uploaded</p>
          )}
        </div>

        {/* Score Breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Score Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Financial History (35%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Portfolio Performance (25%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <span className="text-sm font-medium">72%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Industry Stability (20%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <span className="text-sm font-medium">68%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Business Growth (15%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <span className="text-sm font-medium">78%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Risk Factors (5%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="text-sm font-medium">92%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {application.notes && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{application.notes}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        {application.status === 'pending' && (
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={() => {
                onApprove(application.id);
                onClose();
              }}
              className="flex-1"
            >
              Approve Application
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onReject(application.id);
                onClose();
              }}
              className="flex-1"
            >
              Reject Application
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
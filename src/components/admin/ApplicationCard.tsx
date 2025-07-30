import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Application } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ApplicationCardProps {
  application: Application;
  onViewDetails: (application: Application) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApplicationCard({ application, onViewDetails, onApprove, onReject }: ApplicationCardProps) {
  const getStatusIcon = () => {
    switch (application.status) {
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'rejected':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (application.status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
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

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{application.applicantName}</h3>
            <p className="text-sm text-gray-600">{application.businessName}</p>
            <p className="text-sm text-gray-500">{application.industry}</p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {application.status}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Credit Score</span>
            <span className={`text-lg font-bold ${getScoreColor(application.creditScore)}`}>
              {application.creditScore}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Risk Level</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor()}`}>
              {application.riskLevel}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Requested Amount</span>
            <span className="text-sm font-medium text-gray-900">
              ${application.requestedAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{new Date(application.submissionDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign size={12} />
              <span>${application.monthlyRevenue.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(application)}
            className="flex-1"
          >
            View Details
          </Button>
          {application.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="primary"
                onClick={() => onApprove(application.id)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onReject(application.id)}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
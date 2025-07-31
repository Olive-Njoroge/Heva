import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Layout } from '../../components/shared/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useRef } from 'react';
import Chatbot from '../../components/chatBot';

// Mock data for user score history
const scoreHistory = [
  { month: 'Jul', score: 680 },
  { month: 'Aug', score: 695 },
  { month: 'Sep', score: 715 },
  { month: 'Oct', score: 728 },
  { month: 'Nov', score: 735 },
  { month: 'Dec', score: 742 },
];

const industryInsights = [
  {
    title: 'Fashion Industry Outlook',
    description: 'Spring collections show 15% higher approval rates',
    trend: 'positive'
  },
  {
    title: 'Social Media Impact',
    description: 'Instagram engagement affects scoring by up to 20 points',
    trend: 'neutral'
  },
  {
    title: 'Seasonal Patterns',
    description: 'Q1 typically shows stronger financial performance',
    trend: 'positive'
  }
];

export function UserDashboard() {
  const { user } = useAuth();
  type DocumentItem = {
  id: string;
  name: string;
  category: string;
  status: string;
  uploadDate: string;
  size: string;
  type: string;
  required: boolean;
  description: string;
};

const [documents, setDocuments] = React.useState<DocumentItem[]>([]);

  const bankInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const handleBankUpload = () => {
    bankInputRef.current?.click();
  };

  const handlePortfolioUpload = () => {
    portfolioInputRef.current?.click();
  };

  const handleSocialConnect = () => {
    // Replace with your actual social media OAuth URL
    window.open('https://www.instagram.com/', '_blank');
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 750) return 'from-green-400 to-green-600';
    if (score >= 650) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getTierBadge = (score: number) => {
    if (score >= 750) return { label: 'Rising Star', color: 'bg-green-100 text-green-800' };
    if (score >= 650) return { label: 'Growing Talent', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Emerging Artist', color: 'bg-blue-100 text-blue-800' };
  };

  const creditScore = user?.creditScore || 742;
  const tier = getTierBadge(creditScore);

  return (
    <Layout isAdmin={false}>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-600">Here's your creative credit overview</p>
        </div>

        {/* Credit Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Score Display */}
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Credit Score</h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${tier.color}`}>
                    {tier.label}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  View Detailed Breakdown
                </Button>
              </div>

              <div className="flex items-center space-x-8">
                {/* Score Circle */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className={`w-28 h-28 rounded-full bg-gradient-to-r ${getScoreGradient(creditScore)} flex items-center justify-center`}>
                      <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getScoreColor(creditScore)}`}>
                          {creditScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Details */}
                <div className="flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Credit Utilization</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '77%' }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Portfolio Diversity</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Payment History</span>
                      <span className="text-sm font-medium">98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Change */}
              <div className="mt-6 flex items-center space-x-2 text-green-600">
                <TrendingUp size={16} />
                <span className="text-sm font-medium">+7 points this month</span>
              </div>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card padding="sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Next Review</p>
                  <p className="font-semibold text-gray-900">Feb 15, 2024</p>
                </div>
                <Clock size={20} className="text-blue-600" />
              </div>
            </Card>

            <Card padding="sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <p className="font-semibold text-gray-900">5 of 6 verified</p>
                </div>
                <FileText size={20} className="text-green-600" />
              </div>
            </Card>

            <Card padding="sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Application</p>
                  <p className="font-semibold text-green-600">Approved</p>
                </div>
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </Card>
          </div>
        </div>

        {/* Score Trend Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
              <Tooltip formatter={(value) => [value, 'Credit Score']} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Status */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Application Approved</p>
                    <p className="text-sm text-green-700">Credit limit: $50,000</p>
                  </div>
                </div>
                <span className="text-xs text-green-600">Jan 12, 2024</span>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Next Steps</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-gray-700">Complete profile setup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-gray-700">Upload required documents</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-700">Set up automatic payments</span>
                  </div>
                </div>
              </div>

              <Button variant="primary" size="sm" className="w-full">
                Complete Setup
              </Button>
            </div>
          </Card>

          {/* Industry Insights */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fashion Industry Insights</h3>
            <div className="space-y-4">
              {industryInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {insight.trend === 'positive' ? (
                      <TrendingUp size={16} className="text-green-500 mt-1" />
                    ) : (
                      <AlertCircle size={16} className="text-yellow-500 mt-1" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm" className="w-full">
                View More Insights
              </Button>
            </div>
          </Card>
        </div>

        {/* Action Items */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <FileText size={24} className="text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Upload Bank Statement</h4>
              <p className="text-sm text-gray-600 mb-3">Latest 3 months required</p>
              <Button variant="outline" size="sm" onClick={handleBankUpload}>Upload Now</Button>
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                style={{ display: 'none' }}
                ref={bankInputRef}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Create a new document object
                    const newDoc = {
                      id: Date.now().toString(),
                      name: file.name,
                      category: 'financial',
                      status: 'pending',
                      uploadDate: new Date().toISOString().split('T')[0],
                      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                      type: file.type,
                      required: true,
                      description: 'Uploaded bank statement'
                    };
                    // Add to documents state
                    setDocuments(prev => [...prev, newDoc]);
                    alert(`Bank statement "${file.name}" uploaded!`);
                  }
                }}
              />
            </div>

            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <TrendingUp size={24} className="text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Update Portfolio</h4>
              <p className="text-sm text-gray-600 mb-3">Add recent work samples</p>
              <Button variant="outline" size="sm" onClick={handlePortfolioUpload}>Update Portfolio</Button>
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                style={{ display: 'none' }}
                ref={portfolioInputRef}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const newDoc = {
                      id: Date.now().toString(),
                      name: file.name,
                      category: 'portfolio',
                      status: 'pending',
                      uploadDate: new Date().toISOString().split('T')[0],
                      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                      type: file.type,
                      required: false,
                      description: 'Uploaded portfolio file'
                    };
                    setDocuments(prev => [...prev, newDoc]);
                    alert(`Portfolio file "${file.name}" uploaded!`);
                  }
                }}
              />
            </div>

            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <CheckCircle size={24} className="text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Verify Social Media</h4>
              <p className="text-sm text-gray-600 mb-3">Connect Instagram account</p>
              <Button variant="outline" size="sm" onClick={handleSocialConnect}>Connect Account</Button>
            </div>
          </div>
        </Card>
        
        <Card>
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Uploaded Documents</h3>
  {documents.length === 0 ? (
    <p className="text-gray-500">No documents uploaded yet.</p>
  ) : (
    <ul className="divide-y divide-gray-200">
      {documents.map(doc => (
        <li key={doc.id} className="py-2 flex items-center justify-between">
          <div>
            <span className="font-medium">{doc.name}</span>
            <span className="ml-2 text-xs text-gray-500">{doc.category}</span>
            <span className="ml-2 text-xs text-gray-400">{doc.size}</span>
          </div>
          <span className={`px-2 py-1 rounded text-xs ${
            doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            doc.status === 'verified' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {doc.status}
          </span>
        </li>
      ))}
    </ul>
  )}
</Card>
      </div>
      <Chatbot />
    </Layout>
  );
}
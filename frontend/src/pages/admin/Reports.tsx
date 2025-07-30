import React, { useState } from 'react';
import { Download, Calendar, FileText, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Layout } from '../../components/shared/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  type: 'financial' | 'risk' | 'performance' | 'compliance';
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'portfolio-performance',
    name: 'Portfolio Performance Report',
    description: 'Comprehensive analysis of portfolio health, risk distribution, and performance metrics',
    icon: TrendingUp,
    type: 'performance'
  },
  {
    id: 'monthly-financials',
    name: 'Monthly Financial Summary',
    description: 'Monthly revenue, approval rates, and key financial indicators',
    icon: BarChart3,
    type: 'financial'
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment Report',
    description: 'Detailed risk analysis including alerts, trends, and mitigation strategies',
    icon: PieChart,
    type: 'risk'
  },
  {
    id: 'compliance-audit',
    name: 'Compliance Audit Report',
    description: 'Regulatory compliance status and audit findings',
    icon: FileText,
    type: 'compliance'
  },
  {
    id: 'sector-analysis',
    name: 'Sector Analysis Report',
    description: 'Industry-specific performance analysis and market trends',
    icon: BarChart3,
    type: 'performance'
  },
  {
    id: 'user-activity',
    name: 'User Activity Report',
    description: 'User engagement metrics and application statistics',
    icon: TrendingUp,
    type: 'performance'
  }
];

interface GeneratedReport {
  id: string;
  name: string;
  generatedDate: string;
  size: string;
  format: string;
}

const recentReports: GeneratedReport[] = [
  {
    id: '1',
    name: 'Portfolio Performance Q4 2024',
    generatedDate: '2024-01-15',
    size: '2.4 MB',
    format: 'PDF'
  },
  {
    id: '2',
    name: 'Monthly Financial Summary - December',
    generatedDate: '2024-01-02',
    size: '1.8 MB',
    format: 'Excel'
  },
  {
    id: '3',
    name: 'Risk Assessment - Year End',
    generatedDate: '2024-01-01',
    size: '3.1 MB',
    format: 'PDF'
  }
];

export function Reports() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState('last-month');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async (templateId: string) => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, this would trigger a download
      console.log(`Generating report: ${templateId} in ${format} format for ${dateRange}`);
      alert('Report generated successfully! Download started.');
    }, 2000);
  };

  const handleDownloadReport = (reportId: string) => {
    // Simulate download
    console.log(`Downloading report: ${reportId}`);
    alert('Download started!');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial':
        return 'bg-green-100 text-green-800';
      case 'risk':
        return 'bg-red-100 text-red-800';
      case 'performance':
        return 'bg-blue-100 text-blue-800';
      case 'compliance':
        return 'bg-purple-100 text-purple-800';
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
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Generate and manage system reports</p>
          </div>
          <Button variant="outline">
            <Calendar size={16} className="mr-2" />
            Schedule Reports
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Custom Report Builder</h3>
              <p className="text-sm text-gray-600 mb-4">Create tailored reports with specific metrics and filters</p>
              <Button variant="outline" size="sm">
                Build Report
              </Button>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Download size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Export Data</h3>
              <p className="text-sm text-gray-600 mb-4">Export raw data in various formats for external analysis</p>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Scheduled Reports</h3>
              <p className="text-sm text-gray-600 mb-4">Set up automated report generation and delivery</p>
              <Button variant="outline" size="sm">
                Manage Schedule
              </Button>
            </div>
          </Card>
        </div>

        {/* Report Templates */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Report Templates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                          {template.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      <Button
                        size="sm"
                        onClick={() => handleGenerateReport(template.id)}
                        isLoading={isGenerating}
                      >
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Generation Options */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Report Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="last-week">Last Week</option>
                  <option value="last-month">Last Month</option>
                  <option value="last-quarter">Last Quarter</option>
                  <option value="last-year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button variant="primary" className="w-full">
                  Generate with Options
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Reports */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Report Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Generated</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Size</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Format</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">{report.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(report.generatedDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{report.size}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {report.format}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <Download size={14} className="mr-1" />
                        Download
                      </Button>
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
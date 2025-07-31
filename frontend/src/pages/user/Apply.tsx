import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Upload, DollarSign, Briefcase, FileText } from 'lucide-react';
import { Layout } from '../../components/shared/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface ApplicationData {
  // Step 1: Business Information
  businessType: string;
  industry: string;
  yearsOperating: number;
  teamSize: number;
  businessLocation: string;
  
  // Step 2: Financial Data
  monthlyRevenue: number[];
  majorExpenses: {
    rent: number;
    equipment: number;
    marketing: number;
    materials: number;
    other: number;
  };
  projectedIncome: number;
  
  // Step 3: Portfolio & Projects
  currentProjects: string;
  pastProjectsSuccess: string;
  clientTestimonials: string;
  portfolioLinks: string[];
  
  // Step 4: Review
  terms: boolean;
}

const steps = [
  { id: 1, name: 'Business Info', icon: Briefcase },
  { id: 2, name: 'Financial Data', icon: DollarSign },
  { id: 3, name: 'Portfolio', icon: Upload },
  { id: 4, name: 'Review', icon: FileText }
];

const industries = [
  'Fashion Design', 'Film Production', 'Music Production', 'Digital Art',
  'Photography', 'Graphic Design', 'Architecture', 'Interior Design',
  'Jewelry Design', 'Textile Design', 'Animation', 'Game Development'
];

const businessTypes = [
  'Sole Proprietorship', 'Partnership', 'LLC', 'Corporation', 'Freelancer', 'Other'
];

export function Apply() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    businessType: '',
    industry: user?.industry || '',
    yearsOperating: user?.yearsInBusiness || 0,
    teamSize: 1,
    businessLocation: user?.location || '',
    monthlyRevenue: Array(12).fill(0),
    majorExpenses: {
      rent: 0,
      equipment: 0,
      marketing: 0,
      materials: 0,
      other: 0
    },
    projectedIncome: 0,
    currentProjects: '',
    pastProjectsSuccess: '',
    clientTestimonials: '',
    portfolioLinks: [],
    terms: false
  });

  const updateApplicationData = (field: string, value: any) => {
    setApplicationData(prev => ({ ...prev, [field]: value }));
  };

  const updateExpense = (type: keyof typeof applicationData.majorExpenses, value: number) => {
    setApplicationData(prev => ({
      ...prev,
      majorExpenses: {
        ...prev.majorExpenses,
        [type]: value
      }
    }));
  };

  const updateMonthlyRevenue = (index: number, value: number) => {
    setApplicationData(prev => ({
      ...prev,
      monthlyRevenue: prev.monthlyRevenue.map((rev, i) => i === index ? value : rev)
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Application submitted successfully! You will receive a confirmation email shortly.');
    }, 2000);
  };

  const calculateTotalRevenue = () => {
    return applicationData.monthlyRevenue.reduce((sum, rev) => sum + rev, 0);
  };

  const calculateTotalExpenses = () => {
    return Object.values(applicationData.majorExpenses).reduce((sum, exp) => sum + exp, 0);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return applicationData.businessType && applicationData.industry && applicationData.yearsOperating >= 0;
      case 2:
        return calculateTotalRevenue() > 0;
      case 3:
        return applicationData.currentProjects.length > 0;
      case 4:
        return applicationData.terms;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
            <p className="text-gray-600">Tell us about your creative business</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  value={applicationData.businessType}
                  onChange={(e) => updateApplicationData('businessType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select business type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={applicationData.industry}
                  onChange={(e) => updateApplicationData('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years Operating
                </label>
                <input
                  type="number"
                  value={applicationData.yearsOperating}
                  onChange={(e) => updateApplicationData('yearsOperating', parseInt(e.target.value) || 0)}
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Size
                </label>
                <input
                  type="number"
                  value={applicationData.teamSize}
                  onChange={(e) => updateApplicationData('teamSize', parseInt(e.target.value) || 1)}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Location
              </label>
              <input
                type="text"
                value={applicationData.businessLocation}
                onChange={(e) => updateApplicationData('businessLocation', e.target.value)}
                placeholder="City, State"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 2:
        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Financial Data</h2>
            <p className="text-gray-600">Provide your financial information for the last 12 months</p>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue (Last 12 Months)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {monthNames.map((month, index) => (
                  <div key={month}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {month}
                    </label>
                    <input
                      type="number"
                      value={applicationData.monthlyRevenue[index]}
                      onChange={(e) => updateMonthlyRevenue(index, parseInt(e.target.value) || 0)}
                      placeholder="$0"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Total Annual Revenue: <span className="font-semibold">${calculateTotalRevenue().toLocaleString()}</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Major Monthly Expenses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rent/Studio Space
                  </label>
                  <input
                    type="number"
                    value={applicationData.majorExpenses.rent}
                    onChange={(e) => updateExpense('rent', parseInt(e.target.value) || 0)}
                    placeholder="$0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment/Tools
                  </label>
                  <input
                    type="number"
                    value={applicationData.majorExpenses.equipment}
                    onChange={(e) => updateExpense('equipment', parseInt(e.target.value) || 0)}
                    placeholder="$0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marketing/Advertising
                  </label>
                  <input
                    type="number"
                    value={applicationData.majorExpenses.marketing}
                    onChange={(e) => updateExpense('marketing', parseInt(e.target.value) || 0)}
                    placeholder="$0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Materials/Supplies
                  </label>
                  <input
                    type="number"
                    value={applicationData.majorExpenses.materials}
                    onChange={(e) => updateExpense('materials', parseInt(e.target.value) || 0)}
                    placeholder="$0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Total Monthly Expenses: <span className="font-semibold">${calculateTotalExpenses().toLocaleString()}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projected Annual Income (Next 12 Months)
              </label>
              <input
                type="number"
                value={applicationData.projectedIncome}
                onChange={(e) => updateApplicationData('projectedIncome', parseInt(e.target.value) || 0)}
                placeholder="$0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Portfolio & Projects</h2>
            <p className="text-gray-600">Showcase your work and client relationships</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Project Pipeline
              </label>
              <textarea
                value={applicationData.currentProjects}
                onChange={(e) => updateApplicationData('currentProjects', e.target.value)}
                rows={4}
                placeholder="Describe your current projects, expected timelines, and potential revenue..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Past Project Success Stories
              </label>
              <textarea
                value={applicationData.pastProjectsSuccess}
                onChange={(e) => updateApplicationData('pastProjectsSuccess', e.target.value)}
                rows={4}
                placeholder="Highlight your most successful projects, including metrics and outcomes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Testimonials
              </label>
              <textarea
                value={applicationData.clientTestimonials}
                onChange={(e) => updateApplicationData('clientTestimonials', e.target.value)}
                rows={3}
                placeholder="Share positive feedback from clients or collaborators..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Links
              </label>
              <div className="space-y-3">
                <input
                  type="url"
                  placeholder="Website or portfolio URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="url"
                  placeholder="Social media or marketplace profile"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="url"
                  placeholder="Additional portfolio link"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Drag and drop portfolio files here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, PNG, JPG, ZIP (Max 10MB each)
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Choose Files
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
            <p className="text-gray-600">Please review your information before submitting</p>
            
            {/* Business Information Summary */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Business Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Business Type:</span>
                  <span className="ml-2 font-medium">{applicationData.businessType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Industry:</span>
                  <span className="ml-2 font-medium">{applicationData.industry}</span>
                </div>
                <div>
                  <span className="text-gray-600">Years Operating:</span>
                  <span className="ml-2 font-medium">{applicationData.yearsOperating}</span>
                </div>
                <div>
                  <span className="text-gray-600">Team Size:</span>
                  <span className="ml-2 font-medium">{applicationData.teamSize}</span>
                </div>
              </div>
            </Card>

            {/* Financial Summary */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Financial Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Annual Revenue:</span>
                  <span className="ml-2 font-medium">${calculateTotalRevenue().toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Monthly Expenses:</span>
                  <span className="ml-2 font-medium">${calculateTotalExpenses().toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Projected Income:</span>
                  <span className="ml-2 font-medium">${applicationData.projectedIncome.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Net Monthly:</span>
                  <span className="ml-2 font-medium">
                    ${((calculateTotalRevenue() / 12) - calculateTotalExpenses()).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Terms and Conditions</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 max-h-40 overflow-y-auto">
                  <p className="mb-2">By submitting this application, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Provide accurate and truthful information</li>
                    <li>Allow HEVA to verify submitted information</li>
                    <li>Accept the terms of the credit agreement if approved</li>
                    <li>Understand that credit decisions are based on multiple factors</li>
                    <li>Receive communications regarding your application status</li>
                  </ul>
                </div>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={applicationData.terms}
                    onChange={(e) => updateApplicationData('terms', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and agree to the terms and conditions
                  </span>
                </label>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout isAdmin={false}>
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <Check size={16} />
                    ) : (
                      <Icon size={16} />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      Step {step.id}
                    </p>
                    <p className={`text-xs ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight size={16} className="mx-4 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="min-h-96">
          {renderStepContent()}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft size={16} className="mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < 4 ? (
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
            >
              Next
              <ChevronRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!isStepValid(currentStep)}
              isLoading={isSubmitting}
            >
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
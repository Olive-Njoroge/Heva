import { Application, User, RiskAlert, KPI, ChartData } from '../types';

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    userId: 'user-1',
    applicantName: 'Emma Rodriguez',
    industry: 'Fashion',
    creditScore: 742,
    status: 'approved',
    submissionDate: '2024-01-10',
    reviewDate: '2024-01-12',
    businessName: 'Rodriguez Designs',
    requestedAmount: 50000,
    monthlyRevenue: 12000,
    riskLevel: 'low',
    documents: [
      {
        id: 'doc-1',
        name: 'Financial Statements 2023',
        type: 'pdf',
        status: 'verified',
        uploadDate: '2024-01-10',
        category: 'financial'
      },
      {
        id: 'doc-2',
        name: 'Portfolio Photos',
        type: 'zip',
        status: 'verified',
        uploadDate: '2024-01-10',
        category: 'portfolio'
      }
    ]
  },
  {
    id: 'app-2',
    userId: 'user-2',
    applicantName: 'Marcus Chen',
    industry: 'Film',
    creditScore: 658,
    status: 'pending',
    submissionDate: '2024-01-14',
    businessName: 'Chen Productions',
    requestedAmount: 75000,
    monthlyRevenue: 8500,
    riskLevel: 'medium',
    documents: [
      {
        id: 'doc-3',
        name: 'Film Project Proposal',
        type: 'pdf',
        status: 'pending',
        uploadDate: '2024-01-14',
        category: 'portfolio'
      }
    ]
  },
  {
    id: 'app-3',
    userId: 'user-3',
    applicantName: 'Sophia Martinez',
    industry: 'Music',
    creditScore: 695,
    status: 'pending',
    submissionDate: '2024-01-13',
    businessName: 'Martinez Music Studio',
    requestedAmount: 30000,
    monthlyRevenue: 6500,
    riskLevel: 'low',
    documents: []
  }
];

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Emma Rodriguez',
    email: 'emma@example.com',
    role: 'user',
    industry: 'Fashion',
    creditScore: 742,
    businessName: 'Rodriguez Designs',
    location: 'New York, NY',
    yearsInBusiness: 3,
    applicationStatus: 'approved',
    joinDate: '2023-06-10',
    lastActivity: '2024-01-14T15:45:00Z'
  },
  {
    id: 'user-2',
    name: 'Marcus Chen',
    email: 'marcus@example.com',
    role: 'user',
    industry: 'Film',
    creditScore: 658,
    businessName: 'Chen Productions',
    location: 'Los Angeles, CA',
    yearsInBusiness: 2,
    applicationStatus: 'pending',
    joinDate: '2023-08-22',
    lastActivity: '2024-01-14T12:30:00Z'
  },
  {
    id: 'user-3',
    name: 'Sophia Martinez',
    email: 'sophia@example.com',
    role: 'user',
    industry: 'Music',
    creditScore: 695,
    businessName: 'Martinez Music Studio',
    location: 'Nashville, TN',
    yearsInBusiness: 4,
    applicationStatus: 'pending',
    joinDate: '2023-03-15',
    lastActivity: '2024-01-13T18:20:00Z'
  },
  {
    id: 'user-4',
    name: 'David Kim',
    email: 'david@example.com',
    role: 'user',
    industry: 'Digital',
    creditScore: 721,
    businessName: 'Kim Digital Studio',
    location: 'San Francisco, CA',
    yearsInBusiness: 5,
    applicationStatus: 'approved',
    joinDate: '2022-11-08',
    lastActivity: '2024-01-15T09:15:00Z'
  }
];

export const mockRiskAlerts: RiskAlert[] = [
  {
    id: 'alert-1',
    type: 'payment_delay',
    severity: 'high',
    userId: 'user-2',
    userName: 'Marcus Chen',
    message: 'Payment delay detected - 15 days overdue on current obligation',
    date: '2024-01-14',
    resolved: false
  },
  {
    id: 'alert-2',
    type: 'income_drop',
    severity: 'medium',
    userId: 'user-3',
    userName: 'Sophia Martinez',
    message: '30% drop in monthly revenue compared to previous quarter',
    date: '2024-01-13',
    resolved: false
  },
  {
    id: 'alert-3',
    type: 'industry_risk',
    severity: 'low',
    userId: 'user-1',
    userName: 'Emma Rodriguez',
    message: 'Fashion industry showing seasonal volatility patterns',
    date: '2024-01-12',
    resolved: true
  }
];

export const mockKPIs: KPI[] = [
  { label: 'Total Applications', value: '1,247', change: '+12%', trend: 'up' },
  { label: 'Pending Reviews', value: 23, change: '-5%', trend: 'down' },
  { label: 'Approval Rate', value: '78%', change: '+3%', trend: 'up' },
  { label: 'Portfolio Value', value: '$2.4M', change: '+18%', trend: 'up' },
  { label: 'Active Users', value: 892, change: '+24%', trend: 'up' },
  { label: 'Risk Alerts', value: 5, change: '-2', trend: 'down' }
];

export const applicationTrendsData: ChartData[] = [
  { name: 'Jan', value: 89 },
  { name: 'Feb', value: 95 },
  { name: 'Mar', value: 112 },
  { name: 'Apr', value: 108 },
  { name: 'May', value: 134 },
  { name: 'Jun', value: 142 },
  { name: 'Jul', value: 156 },
  { name: 'Aug', value: 163 },
  { name: 'Sep', value: 148 },
  { name: 'Oct', value: 172 },
  { name: 'Nov', value: 185 },
  { name: 'Dec', value: 194 }
];

export const approvalRatesBySector: ChartData[] = [
  { name: 'Fashion', value: 82 },
  { name: 'Film', value: 71 },
  { name: 'Music', value: 85 },
  { name: 'Digital', value: 89 },
  { name: 'Art', value: 76 },
  { name: 'Performing', value: 68 }
];

export const riskDistributionData: ChartData[] = [
  { name: 'Low Risk', value: 65 },
  { name: 'Medium Risk', value: 28 },
  { name: 'High Risk', value: 7 }
];

export const geographicData: ChartData[] = [
  { name: 'California', value: 342 },
  { name: 'New York', value: 298 },
  { name: 'Texas', value: 156 },
  { name: 'Florida', value: 134 },
  { name: 'Illinois', value: 98 },
  { name: 'Others', value: 219 }
];
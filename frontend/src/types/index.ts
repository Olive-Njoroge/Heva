export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  industry?: string;
  creditScore?: number;
  profileImage?: string;
  businessName?: string;
  location?: string;
  yearsInBusiness?: number;
  applicationStatus?: 'pending' | 'approved' | 'rejected' | 'draft';
  joinDate: string;
  lastActivity?: string;
}

export interface Application {
  id: string;
  userId: string;
  applicantName: string;
  industry: string;
  creditScore: number;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: string;
  reviewDate?: string;
  businessName: string;
  requestedAmount: number;
  monthlyRevenue: number;
  documents: Document[];
  riskLevel: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: 'verified' | 'pending' | 'rejected';
  uploadDate: string;
  category: 'financial' | 'legal' | 'portfolio' | 'reference';
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: string[];
}

export interface RiskAlert {
  id: string;
  type: 'payment_delay' | 'income_drop' | 'industry_risk' | 'document_issue';
  severity: 'high' | 'medium' | 'low';
  userId: string;
  userName: string;
  message: string;
  date: string;
  resolved: boolean;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface ChartData {
  name: string;
  value: number;
  industry?: string;
  month?: string;
  sector?: string;
}
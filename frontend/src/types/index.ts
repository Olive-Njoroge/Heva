/**
 * TypeScript Type Definitions
 * 
 * Central type definitions for the Heva credit decisioning platform.
 * Provides type safety and IntelliSense support across the application.
 * 
 * Features:
 * - User management types
 * - Application processing types
 * - Document handling types
 * - Chat system types
 * - Credit decision types
 * - Admin dashboard types
 * 
 * @author Heva Team
 * @version 1.0
 */

/**
 * User interface representing system users (both customers and admins)
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** Full name of the user */
  name: string;
  /** Email address */
  email: string;
  /** User role for access control */
  role: 'admin' | 'user';
  /** Industry sector (for customers) */
  industry?: string;
  /** Current credit score */
  creditScore?: number;
  /** Profile image URL */
  profileImage?: string;
  /** Business/company name */
  businessName?: string;
  /** Geographic location */
  location?: string;
  /** Years in business operation */
  yearsInBusiness?: number;
  /** Current application status */
  applicationStatus?: 'pending' | 'approved' | 'rejected' | 'draft';
  /** Date when user joined the platform */
  joinDate: string;
  /** Last activity timestamp */
  lastActivity?: string;
}

/**
 * Application interface representing loan/credit applications
 */
export interface Application {
  /** Unique application identifier */
  id: string;
  /** ID of the user who submitted the application */
  userId: string;
  /** Name of the applicant */
  applicantName: string;
  /** Industry sector of the applicant */
  industry: string;
  /** Calculated credit score */
  creditScore: number;
  /** Current application status */
  status: 'pending' | 'approved' | 'rejected';
  /** Date when application was submitted */
  submissionDate: string;
  /** Date when application was reviewed (if applicable) */
  reviewDate?: string;
  /** Business name */
  businessName: string;
  /** Requested loan amount */
  requestedAmount: number;
  /** Monthly revenue of the business */
  monthlyRevenue: number;
  /** Associated documents */
  documents: Document[];
  /** Assessed risk level */
  riskLevel: 'low' | 'medium' | 'high';
  /** Additional review notes */
  notes?: string;
}

/**
 * Document interface representing uploaded files and their verification status
 */
export interface Document {
  /** Unique document identifier */
  id: string;
  /** Original file name */
  name: string;
  /** File type/extension */
  type: string;
  /** Verification status */
  status: 'verified' | 'pending' | 'rejected';
  /** Upload timestamp */
  uploadDate: string;
  /** Document category for organization */
  category: 'financial' | 'legal' | 'portfolio' | 'reference';
}

/**
 * Chat message interface for the AI chatbot system
 */
export interface ChatMessage {
  /** Unique message identifier */
  id: string;
  /** Message content */
  text: string;
  /** Message sender type */
  sender: 'user' | 'bot';
  /** Message timestamp */
  timestamp: Date;
  /** Optional quick reply suggestions */
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
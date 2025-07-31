import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Users, 
  AlertTriangle, 
  FileOutput,
  Settings,
  User,
  Upload,
  CreditCard,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  isAdmin: boolean;
}

export function Sidebar({ isAdmin }: SidebarProps) {
  const location = useLocation();

  const adminMenuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/applications', icon: FileText, label: 'Applications' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/risk-management', icon: AlertTriangle, label: 'Risk Management' },
    { path: '/admin/reports', icon: FileOutput, label: 'Reports' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  const userMenuItems = [
    { path: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/user/profile', icon: User, label: 'Profile' },
    { path: '/user/apply', icon: FileText, label: 'Apply' },
    { path: '/user/documents', icon: Upload, label: 'Documents' },
    { path: '/user/score', icon: CreditCard, label: 'Credit Score' },
    { path: '/user/help', icon: HelpCircle, label: 'Help' }
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen overflow-y-auto">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
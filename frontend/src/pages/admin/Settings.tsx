import React, { useState } from 'react';
import { Save, Bell, Shield, Database, Users, Mail } from 'lucide-react';
import { Layout } from '../../components/shared/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      riskAlerts: true,
      applicationUpdates: true,
      weeklyReports: false
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: '30',
      passwordExpiry: '90'
    },
    system: {
      maintenanceMode: false,
      autoBackup: true,
      backupFrequency: 'daily',
      logRetention: '30'
    },
    scoring: {
      defaultModel: 'enhanced',
      riskThreshold: '650',
      autoApproval: false,
      reviewThreshold: '700'
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Simulate saving settings
    setTimeout(() => {
      setHasChanges(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <Layout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Configure system preferences and security</p>
          </div>
          {hasChanges && (
            <Button variant="primary" onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          )}
        </div>

        {/* Notification Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Bell size={24} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Email Alerts</h3>
                <p className="text-sm text-gray-600">Receive email notifications for system events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailAlerts}
                  onChange={(e) => updateSetting('notifications', 'emailAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Risk Alerts</h3>
                <p className="text-sm text-gray-600">Get notified about high-risk activities</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.riskAlerts}
                  onChange={(e) => updateSetting('notifications', 'riskAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Application Updates</h3>
                <p className="text-sm text-gray-600">Notifications for new applications and status changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.applicationUpdates}
                  onChange={(e) => updateSetting('notifications', 'applicationUpdates', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Weekly Reports</h3>
                <p className="text-sm text-gray-600">Receive automated weekly performance reports</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyReports}
                  onChange={(e) => updateSetting('notifications', 'weeklyReports', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Shield size={24} className="text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Expiry (days)
              </label>
              <select
                value={settings.security.passwordExpiry}
                onChange={(e) => updateSetting('security', 'passwordExpiry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security to admin accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* System Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Database size={24} className="text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-600">Temporarily disable user access for maintenance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.system.maintenanceMode}
                  onChange={(e) => updateSetting('system', 'maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Automatic Backup</h3>
                <p className="text-sm text-gray-600">Enable automatic database backups</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.system.autoBackup}
                  onChange={(e) => updateSetting('system', 'autoBackup', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={settings.system.backupFrequency}
                  onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Log Retention (days)
                </label>
                <select
                  value={settings.system.logRetention}
                  onChange={(e) => updateSetting('system', 'logRetention', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Credit Scoring Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Users size={24} className="text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">Credit Scoring Settings</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Scoring Model
                </label>
                <select
                  value={settings.scoring.defaultModel}
                  onChange={(e) => updateSetting('scoring', 'defaultModel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="basic">Basic Model</option>
                  <option value="enhanced">Enhanced Model</option>
                  <option value="advanced">Advanced AI Model</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Threshold
                </label>
                <select
                  value={settings.scoring.riskThreshold}
                  onChange={(e) => updateSetting('scoring', 'riskThreshold', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="600">600 (Higher Risk Tolerance)</option>
                  <option value="650">650 (Standard)</option>
                  <option value="700">700 (Conservative)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Auto-Approval</h3>
                <p className="text-sm text-gray-600">Automatically approve high-score applications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.scoring.autoApproval}
                  onChange={(e) => updateSetting('scoring', 'autoApproval', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.scoring.autoApproval && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-Approval Threshold
                </label>
                <select
                  value={settings.scoring.reviewThreshold}
                  onChange={(e) => updateSetting('scoring', 'reviewThreshold', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="700">700</option>
                  <option value="750">750</option>
                  <option value="800">800</option>
                </select>
              </div>
            )}
          </div>
        </Card>

        {/* Save Button */}
        {hasChanges && (
          <div className="fixed bottom-6 right-6">
            <Button variant="primary" size="lg" onClick={handleSave}>
              <Save size={20} className="mr-2" />
              Save All Changes
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
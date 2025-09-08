'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Database,
  Save,
  RotateCcw,
  Download
} from 'lucide-react';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  settings: Setting[];
}

interface Setting {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'input' | 'textarea';
  value: any;
  options?: { label: string; value: any }[];
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState<SettingSection[]>([
    {
      id: 'general',
      title: 'General',
      description: 'Basic application settings',
      icon: <Settings className="w-5 h-5" />,
      settings: [
        {
          id: 'app_name',
          label: 'Application Name',
          description: 'The name displayed in the application',
          type: 'input',
          value: 'Amrikyy AI'
        },
        {
          id: 'theme',
          label: 'Theme',
          description: 'Choose your preferred theme',
          type: 'select',
          value: 'dark',
          options: [
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
            { label: 'Auto', value: 'auto' }
          ]
        },
        {
          id: 'language',
          label: 'Language',
          description: 'Interface language',
          type: 'select',
          value: 'en',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Arabic', value: 'ar' },
            { label: 'Spanish', value: 'es' }
          ]
        }
      ]
    },
    {
      id: 'account',
      title: 'Account',
      description: 'User account settings',
      icon: <User className="w-5 h-5" />,
      settings: [
        {
          id: 'email',
          label: 'Email',
          description: 'Your email address',
          type: 'input',
          value: 'admin@amrikyy.com'
        },
        {
          id: 'notifications',
          label: 'Email Notifications',
          description: 'Receive email notifications',
          type: 'toggle',
          value: true
        },
        {
          id: 'two_factor',
          label: 'Two-Factor Authentication',
          description: 'Enable 2FA for enhanced security',
          type: 'toggle',
          value: true
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Notification preferences',
      icon: <Bell className="w-5 h-5" />,
      settings: [
        {
          id: 'push_notifications',
          label: 'Push Notifications',
          description: 'Receive push notifications',
          type: 'toggle',
          value: true
        },
        {
          id: 'sound_notifications',
          label: 'Sound Notifications',
          description: 'Play sound for notifications',
          type: 'toggle',
          value: false
        },
        {
          id: 'notification_frequency',
          label: 'Notification Frequency',
          description: 'How often to receive notifications',
          type: 'select',
          value: 'immediate',
          options: [
            { label: 'Immediate', value: 'immediate' },
            { label: 'Hourly', value: 'hourly' },
            { label: 'Daily', value: 'daily' }
          ]
        }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Visual customization',
      icon: <Palette className="w-5 h-5" />,
      settings: [
        {
          id: 'primary_color',
          label: 'Primary Color',
          description: 'Main theme color',
          type: 'select',
          value: 'blue',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Purple', value: 'purple' },
            { label: 'Green', value: 'green' },
            { label: 'Red', value: 'red' }
          ]
        },
        {
          id: 'font_size',
          label: 'Font Size',
          description: 'Interface font size',
          type: 'select',
          value: 'medium',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' }
          ]
        },
        {
          id: 'animations',
          label: 'Animations',
          description: 'Enable interface animations',
          type: 'toggle',
          value: true
        }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Security and privacy settings',
      icon: <Shield className="w-5 h-5" />,
      settings: [
        {
          id: 'session_timeout',
          label: 'Session Timeout',
          description: 'Auto-logout after inactivity',
          type: 'select',
          value: '30',
          options: [
            { label: '15 minutes', value: '15' },
            { label: '30 minutes', value: '30' },
            { label: '1 hour', value: '60' },
            { label: 'Never', value: 'never' }
          ]
        },
        {
          id: 'ip_whitelist',
          label: 'IP Whitelist',
          description: 'Restrict access by IP address',
          type: 'toggle',
          value: false
        },
        {
          id: 'audit_logging',
          label: 'Audit Logging',
          description: 'Log all user activities',
          type: 'toggle',
          value: true
        }
      ]
    },
    {
      id: 'data',
      title: 'Data & Privacy',
      description: 'Data management and privacy',
      icon: <Database className="w-5 h-5" />,
      settings: [
        {
          id: 'data_retention',
          label: 'Data Retention',
          description: 'How long to keep user data',
          type: 'select',
          value: '90',
          options: [
            { label: '30 days', value: '30' },
            { label: '90 days', value: '90' },
            { label: '1 year', value: '365' },
            { label: 'Forever', value: 'forever' }
          ]
        },
        {
          id: 'analytics',
          label: 'Analytics',
          description: 'Collect usage analytics',
          type: 'toggle',
          value: true
        },
        {
          id: 'crash_reports',
          label: 'Crash Reports',
          description: 'Send crash reports for debugging',
          type: 'toggle',
          value: true
        }
      ]
    }
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (sectionId: string, settingId: string, value: any) => {
    setSettings(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            settings: section.settings.map(setting =>
              setting.id === settingId ? { ...setting, value } : setting
            )
          }
        : section
    ));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Simulate saving settings
    console.log('Saving settings:', settings);
    setHasChanges(false);
    // Show success message
  };

  const resetSettings = () => {
    // Reset to default values
    setHasChanges(false);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'amrikyy-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderSetting = (setting: Setting, sectionId: string) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <button
            onClick={() => updateSetting(sectionId, setting.id, !setting.value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              setting.value ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                setting.value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        );
      
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => updateSetting(sectionId, setting.id, e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'input':
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => updateSetting(sectionId, setting.id, e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={setting.value}
            onChange={(e) => updateSetting(sectionId, setting.id, e.target.value)}
            rows={3}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full resize-none"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Configure your application preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              {hasChanges && (
                <div className="flex items-center space-x-2 text-yellow-400">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-sm">Unsaved changes</span>
                </div>
              )}
              <button
                onClick={exportSettings}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={resetSettings}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={saveSettings}
                disabled={!hasChanges}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  hasChanges
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {settings.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            {settings
              .filter(section => section.id === activeSection)
              .map((section) => (
                <div key={section.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    {section.icon}
                    <div>
                      <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                      <p className="text-gray-400">{section.description}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {section.settings.map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{setting.label}</h3>
                          <p className="text-gray-400 text-sm">{setting.description}</p>
                        </div>
                        <div className="ml-4">
                          {renderSetting(setting, section.id)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

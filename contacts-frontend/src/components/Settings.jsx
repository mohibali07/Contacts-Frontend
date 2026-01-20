import React, { useState } from 'react';
import { Save, Trash2, Shield, User, Monitor } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 sm:p-10 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Manage your account settings and application preferences.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-4 space-y-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'general' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <Monitor className="h-4 w-4" /> General
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'security' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <Shield className="h-4 w-4" /> Security
            </button>
            <button
              onClick={() => setActiveTab('danger')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'danger' 
                  ? 'bg-red-50 text-red-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <Trash2 className="h-4 w-4" /> Danger Zone
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8">
            
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Application Information</h3>
                  <p className="text-sm text-slate-500">Details about the current version.</p>
                </div>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-500">App Name</span>
                    <span className="md:col-span-2 text-sm font-bold text-slate-900">i finance</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-500">Version</span>
                    <span className="md:col-span-2 text-sm font-bold text-slate-900">v1.0.0 (Beta)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-500">Theme</span>
                    <span className="md:col-span-2 text-sm font-bold text-slate-900">Light (Premium)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Security</h3>
                  <p className="text-sm text-slate-500">Update your password and security preferences.</p>
                </div>
                
                <form className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                    <input type="password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                    <input type="password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <button type="button" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-lg font-bold text-red-600">Danger Zone</h3>
                  <p className="text-sm text-slate-500">Irreversible actions for your account and data.</p>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                  <h4 className="font-bold text-red-900 mb-2">Reset Application Data</h4>
                  <p className="text-sm text-red-700 mb-4">
                    This will clear all local storage data, including users, tasks, departments, and settings. 
                    You will be logged out immediately. This action cannot be undone.
                  </p>
                  
                  {!showResetConfirm ? (
                    <button 
                      onClick={() => setShowResetConfirm(true)}
                      className="px-6 py-2.5 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      Reset All Data
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                      <button 
                        onClick={handleResetData}
                        className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                      >
                        Confirm Reset
                      </button>
                      <button 
                        onClick={() => setShowResetConfirm(false)}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

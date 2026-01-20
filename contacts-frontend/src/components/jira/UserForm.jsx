import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Edit2, Plus, Eye, X } from 'lucide-react';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirmation: '',
    linkedContact: '',
    role: '',
    department: ''
  });

  const [roleOptions, setRoleOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  // Mock contacts for now as we don't have a persistent store for them accessible easily here without context/api
  const [contactOptions, setContactOptions] = useState(['John Doe', 'Jane Smith', 'Alice Johnson']); 

  // Load data
  useEffect(() => {
    // Load Roles
    const savedRoles = localStorage.getItem('jira_roles');
    if (savedRoles) {
      setRoleOptions(JSON.parse(savedRoles).map(r => r.name));
    } else {
      setRoleOptions(['Admin', 'Manager', 'Developer']);
    }

    // Load Departments
    const savedDepts = localStorage.getItem('jira_departments');
    if (savedDepts) {
      setDepartmentOptions(JSON.parse(savedDepts).map(d => d.name));
    } else {
      setDepartmentOptions(['Development', 'HR', 'Designing']);
    }

    // Load User if editing
    if (isEdit) {
      const savedUsers = localStorage.getItem('jira_users');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const user = users.find(u => u.id === parseInt(id));
        if (user) {
          setFormData({
            username: user.username || '',
            password: '', // Don't show password
            passwordConfirmation: '',
            linkedContact: user.linkedContact || '',
            role: user.role || '',
            department: user.department || ''
          });
        }
      }
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveUser = (redirectMode) => {
    if (formData.password && formData.password !== formData.passwordConfirmation) {
      alert("Passwords do not match!");
      return;
    }

    const saved = localStorage.getItem('jira_users');
    let users = saved ? JSON.parse(saved) : [];
    let newId = null;

    const userPayload = {
      username: formData.username,
      linkedContact: formData.linkedContact,
      role: formData.role || '-',
      department: formData.department || '-',
      staff_status: true // Default to true for now
    };

    if (isEdit) {
      users = users.map(u => u.id === parseInt(id) ? { ...u, ...userPayload } : u);
    } else {
      newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      users.push({ id: newId, ...userPayload });
    }

    localStorage.setItem('jira_users', JSON.stringify(users));

    // Handle Redirection
    if (redirectMode === 'list') {
      navigate('/users');
    } else if (redirectMode === 'add_another') {
      setFormData({
        username: '',
        passwordConfirmation: '',
        linkedContact: '',
        role: '',
        department: ''
      });
      if (isEdit) {
        navigate('/users/add');
      }
    } else if (redirectMode === 'continue') {
      if (!isEdit && newId) {
        navigate(`/users/edit/${newId}`, { replace: true });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUser('list');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 p-6 sm:p-10 font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/users')}
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:shadow-sm"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isEdit ? 'Change user' : 'Add user'}
              </h1>
              {!isEdit && (
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
                  Create a new user account and assign roles.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Username */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 dark:text-slate-300 pt-3">
                Username
              </label>
              <div className="md:col-span-9">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="e.g. johndoe"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium"
                />
                <p className="mt-2 text-xs text-slate-400">Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.</p>
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 dark:text-slate-300 pt-3">
                Password
              </label>
              <div className="md:col-span-9">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isEdit ? "Leave blank to keep current password" : "Enter password"}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Confirmation */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 dark:text-slate-300 pt-3">
                Password confirmation
              </label>
              <div className="md:col-span-9">
                <input
                  type="password"
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium"
                />
              </div>
            </div>

            <div className="w-full h-px bg-slate-50 dark:bg-slate-700"></div>

            {/* Linked Contact */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 dark:text-slate-300 pt-3">
                Linked Contact
              </label>
              <div className="md:col-span-9">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <select
                      name="linkedContact"
                      value={formData.linkedContact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="">None</option>
                      {contactOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button type="button" className="p-2 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 rounded-md transition-all shadow-sm text-slate-500 dark:text-slate-400">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-white dark:hover:bg-slate-800 hover:text-green-600 rounded-md transition-all shadow-sm text-slate-500 dark:text-slate-400">
                      <Plus className="h-4 w-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 rounded-md transition-all shadow-sm text-slate-500 dark:text-slate-400">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-slate-50 dark:bg-slate-700"></div>

            {/* Role */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 dark:text-slate-300 pt-3">
                Role
              </label>
              <div className="md:col-span-9">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="">None</option>
                      {roleOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button type="button" className="p-2 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 rounded-md transition-all shadow-sm text-slate-500 dark:text-slate-400">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-white dark:hover:bg-slate-800 hover:text-green-600 rounded-md transition-all shadow-sm text-slate-500 dark:text-slate-400">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Department */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 dark:text-slate-300 pt-3">
                Department
              </label>
              <div className="md:col-span-9">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="">None</option>
                      {departmentOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button type="button" className="p-2 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 rounded-md transition-all shadow-sm text-slate-500 dark:text-slate-400">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-white dark:hover:bg-slate-800 hover:text-green-600 rounded-md transition-all shadow-sm text-slate-500 dark:text-slate-400">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save User
            </button>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => saveUser('add_another')}
                className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              >
                Save and add another
              </button>
              <button
                type="button"
                onClick={() => saveUser('continue')}
                className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              >
                Save and continue editing
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;

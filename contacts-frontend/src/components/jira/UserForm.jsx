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
    <div className="min-h-screen bg-gray-900 p-6 sm:p-10 font-sans text-slate-100"> 
    {/* Using dark theme base to match screenshot somewhat, or stick to light theme? 
       The screenshot shows a dark theme. I should probably stick to the light theme I've been using 
       unless the user explicitly asked for dark mode everywhere. 
       Wait, the screenshot IS dark mode. But previous screens were light. 
       I will stick to the LIGHT theme for consistency with my previous work (Departments/Roles), 
       unless I want to pivot. The user said "premium", usually consistency is key. 
       I will use the LIGHT theme but structure it exactly like the screenshot. 
       Actually, let's stick to the light theme I built for Departments/Roles to avoid jarring transitions.
    */}
    <div className="min-h-screen bg-gray-50/50 p-6 sm:p-10 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/users')}
              className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 hover:text-slate-700 hover:shadow-sm"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {isEdit ? 'Change user' : 'Add user'}
              </h1>
              {!isEdit && (
                <p className="text-slate-500 mt-1 text-sm font-medium">
                  After you've created a user, you'll be able to edit more user options.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Username */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 pt-3">
                Username:
              </label>
              <div className="md:col-span-9">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium"
                />
                <p className="mt-2 text-xs text-slate-400">Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.</p>
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 pt-3">
                Password:
              </label>
              <div className="md:col-span-9">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Confirmation */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 pt-3">
                Password confirmation:
              </label>
              <div className="md:col-span-9">
                <input
                  type="password"
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium"
                />
              </div>
            </div>

            {/* Contact Profile Section */}
            <div className="mt-8">
              <div className="bg-blue-600 px-4 py-2 rounded-t-lg">
                <h3 className="text-white font-bold text-sm uppercase tracking-wide">Contact Profile</h3>
              </div>
              <div className="bg-slate-50 border border-slate-200 border-t-0 rounded-b-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <label className="md:col-span-3 text-sm font-bold text-slate-700">
                    Linked Contact:
                  </label>
                  <div className="md:col-span-9 flex items-center gap-3">
                    <select
                      name="linkedContact"
                      value={formData.linkedContact}
                      onChange={handleChange}
                      className="w-full max-w-md px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium cursor-pointer"
                    >
                      <option value="">---------</option>
                      {contactOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Edit2 className="h-4 w-4 hover:text-blue-600 cursor-pointer" />
                      <Plus className="h-5 w-5 hover:text-green-600 cursor-pointer" />
                      <Eye className="h-5 w-5 hover:text-slate-800 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Section */}
            <div className="mt-8">
              <div className="bg-blue-600 px-4 py-2 rounded-t-lg">
                <h3 className="text-white font-bold text-sm uppercase tracking-wide">Organization</h3>
              </div>
              <div className="bg-slate-50 border border-slate-200 border-t-0 rounded-b-lg p-6 space-y-6">
                
                {/* Role */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <label className="md:col-span-3 text-sm font-bold text-slate-700">
                    Role:
                  </label>
                  <div className="md:col-span-9 flex items-center gap-3">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full max-w-md px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium cursor-pointer"
                    >
                      <option value="">---------</option>
                      {roleOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Edit2 className="h-4 w-4 hover:text-blue-600 cursor-pointer" />
                      <Plus className="h-5 w-5 hover:text-green-600 cursor-pointer" />
                      <X className="h-5 w-5 hover:text-red-600 cursor-pointer" />
                      <Eye className="h-5 w-5 hover:text-slate-800 cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <label className="md:col-span-3 text-sm font-bold text-slate-700">
                    Department:
                  </label>
                  <div className="md:col-span-9 flex items-center gap-3">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full max-w-md px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium cursor-pointer"
                    >
                      <option value="">---------</option>
                      {departmentOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Edit2 className="h-4 w-4 hover:text-blue-600 cursor-pointer" />
                      <Plus className="h-5 w-5 hover:text-green-600 cursor-pointer" />
                      <X className="h-5 w-5 hover:text-red-600 cursor-pointer" />
                      <Eye className="h-5 w-5 hover:text-slate-800 cursor-pointer" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              SAVE
            </button>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => saveUser('add_another')}
                className="flex-1 sm:flex-none px-6 py-3 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
              >
                Save and add another
              </button>
              <button
                type="button"
                onClick={() => saveUser('continue')}
                className="flex-1 sm:flex-none px-6 py-3 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
              >
                Save and continue editing
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default UserForm;

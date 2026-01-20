import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

const RoleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    canViewAllTasks: false,
    canViewAllTeams: false,
    isTeamLeadRole: false
  });

  // Load data
  useEffect(() => {
    if (isEdit) {
      const savedRoles = localStorage.getItem('jira_roles');
      if (savedRoles) {
        const roles = JSON.parse(savedRoles);
        const role = roles.find(r => r.id === parseInt(id));
        if (role) {
          setFormData({
            name: role.name || '',
            description: role.description || '',
            canViewAllTasks: role.canViewAllTasks || false,
            canViewAllTeams: role.canViewAllTeams || false,
            isTeamLeadRole: role.isTeamLeadRole || false
          });
        }
      }
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const saveRole = (redirectMode) => {
    const saved = localStorage.getItem('jira_roles');
    let roles = saved ? JSON.parse(saved) : [];
    let newId = null;

    if (isEdit) {
      roles = roles.map(r => r.id === parseInt(id) ? { ...r, ...formData } : r);
    } else {
      newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
      roles.push({ id: newId, ...formData });
    }

    localStorage.setItem('jira_roles', JSON.stringify(roles));

    // Handle Redirection
    if (redirectMode === 'list') {
      navigate('/jira/roles');
    } else if (redirectMode === 'add_another') {
      setFormData({
        name: '',
        description: '',
        canViewAllTasks: false,
        canViewAllTeams: false,
        isTeamLeadRole: false
      });
      if (isEdit) {
        navigate('/jira/roles/add');
      }
    } else if (redirectMode === 'continue') {
      if (!isEdit && newId) {
        navigate(`/jira/roles/edit/${newId}`, { replace: true });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveRole('list');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 sm:p-10 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/jira/roles')}
              className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 hover:text-slate-700 hover:shadow-sm"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {isEdit ? 'Change role' : 'Add role'}
              </h1>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Name Field */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 pt-3">
                Name
              </label>
              <div className="md:col-span-9">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium"
                />
              </div>
            </div>

            <div className="w-full h-px bg-slate-50"></div>

            {/* Description Field */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 pt-3">
                Description
              </label>
              <div className="md:col-span-9">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium resize-y"
                />
              </div>
            </div>

            {/* Permissions Section */}
            <div className="mt-8">
              <div className="bg-blue-600 px-4 py-2 rounded-t-lg">
                <h3 className="text-white font-bold text-sm uppercase tracking-wide">Permissions</h3>
              </div>
              <div className="bg-slate-50 border border-slate-200 border-t-0 rounded-b-lg p-6 space-y-6">
                <p className="text-sm text-slate-500 mb-4">Check boxes to grant specific permissions.</p>
                
                {/* Permission 1 */}
                <div className="flex items-start gap-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="canViewAllTasks"
                      name="canViewAllTasks"
                      type="checkbox"
                      checked={formData.canViewAllTasks}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="canViewAllTasks" className="font-medium text-slate-900">
                      Can view all tasks
                    </label>
                    <p className="text-slate-500">Can view all tasks in the system.</p>
                  </div>
                </div>

                {/* Permission 2 */}
                <div className="flex items-start gap-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="canViewAllTeams"
                      name="canViewAllTeams"
                      type="checkbox"
                      checked={formData.canViewAllTeams}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="canViewAllTeams" className="font-medium text-slate-900">
                      Can view all teams
                    </label>
                    <p className="text-slate-500">Can view all teams in the system.</p>
                  </div>
                </div>

                {/* Permission 3 */}
                <div className="flex items-start gap-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="isTeamLeadRole"
                      name="isTeamLeadRole"
                      type="checkbox"
                      checked={formData.isTeamLeadRole}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="isTeamLeadRole" className="font-medium text-slate-900">
                      Is team lead role
                    </label>
                    <p className="text-slate-500">If True, restricts view to own team/subordinates (logic handled in Admin).</p>
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
                onClick={() => saveRole('add_another')}
                className="flex-1 sm:flex-none px-6 py-3 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
              >
                Save and add another
              </button>
              <button
                type="button"
                onClick={() => saveRole('continue')}
                className="flex-1 sm:flex-none px-6 py-3 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
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

export default RoleForm;

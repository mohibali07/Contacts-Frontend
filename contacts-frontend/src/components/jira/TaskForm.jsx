import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Edit2, Plus, X, Eye, Calendar } from 'lucide-react';

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    deadline: '',
    assigned_to: '',
    team: '',
    assigned_by: 'Admin (admin)', // Mock current user
    created_at: '',
    updated_at: ''
  });

  const [userOptions, setUserOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);

  // Load data
  useEffect(() => {
    // Load Users
    const savedUsers = localStorage.getItem('jira_users');
    if (savedUsers) {
      setUserOptions(JSON.parse(savedUsers).map(u => ({
        id: u.id,
        label: `${u.username} (${u.role || 'No Role'})`,
        value: u.username
      })));
    } else {
      setUserOptions([{ id: 1, label: 'admin (No Role)', value: 'admin' }]);
    }

    // Load Teams
    const savedTeams = localStorage.getItem('jira_teams');
    if (savedTeams) {
      setTeamOptions(JSON.parse(savedTeams).map(t => ({
        id: t.id,
        label: t.name,
        value: t.name
      })));
    }

    // Load Task if editing
    if (isEdit) {
      const savedTasks = localStorage.getItem('jira_tasks');
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        const task = tasks.find(t => t.id === parseInt(id));
        if (task) {
          setFormData(task);
        }
      }
    } else {
      // Set Created At for new task
      setFormData(prev => ({
        ...prev,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, deadline: today }));
  };

  const saveTask = (redirectMode) => {
    const saved = localStorage.getItem('jira_tasks');
    let tasks = saved ? JSON.parse(saved) : [];
    let newId = null;

    const taskPayload = {
      ...formData,
      updated_at: new Date().toISOString()
    };

    if (isEdit) {
      tasks = tasks.map(t => t.id === parseInt(id) ? { ...t, ...taskPayload } : t);
    } else {
      newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      tasks.push({ id: newId, ...taskPayload });
    }

    localStorage.setItem('jira_tasks', JSON.stringify(tasks));

    // Handle Redirection
    if (redirectMode === 'list') {
      navigate('/tasks');
    } else if (redirectMode === 'add_another') {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        deadline: '',
        assigned_to: '',
        team: '',
        assigned_by: 'Admin (admin)',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      if (isEdit) {
        navigate('/tasks/add');
      }
    } else if (redirectMode === 'continue') {
      if (!isEdit && newId) {
        navigate(`/tasks/edit/${newId}`, { replace: true });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveTask('list');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 p-6 sm:p-10 font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/tasks')}
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:shadow-sm"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isEdit ? 'Change task' : 'Add task'}
              </h1>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Title:
              </label>
              <div className="md:col-span-10">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium"
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300 pt-3">
                Description:
              </label>
              <div className="md:col-span-10">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full max-w-2xl px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium resize-y"
                />
              </div>
            </div>

            <div className="w-full h-px bg-slate-50 dark:bg-slate-700"></div>

            {/* Priority */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Priority:
              </label>
              <div className="md:col-span-10">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full max-w-xs px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Status:
              </label>
              <div className="md:col-span-10">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full max-w-xs px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Deadline:
              </label>
              <div className="md:col-span-10 flex items-center gap-3">
                <div className="relative">
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  <button type="button" onClick={setToday} className="text-blue-600 hover:underline font-medium">Today</button> | 
                  <span className="ml-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">📅</span>
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-slate-50 dark:bg-slate-700"></div>

            {/* Assigned To */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Assigned to:
              </label>
              <div className="md:col-span-10 flex items-center gap-3">
                <select
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleChange}
                  className="w-full max-w-md px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium cursor-pointer"
                >
                  <option value="">---------</option>
                  {userOptions.map(opt => (
                    <option key={opt.id} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                  <Edit2 className="h-4 w-4 hover:text-blue-600 cursor-pointer" />
                  <Plus className="h-5 w-5 hover:text-green-600 cursor-pointer" />
                  <Eye className="h-5 w-5 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Team:
              </label>
              <div className="md:col-span-10 flex items-center gap-3">
                <select
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  className="w-full max-w-md px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium cursor-pointer"
                >
                  <option value="">---------</option>
                  {teamOptions.map(opt => (
                    <option key={opt.id} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                  <Edit2 className="h-4 w-4 hover:text-blue-600 cursor-pointer" />
                  <Plus className="h-5 w-5 hover:text-green-600 cursor-pointer" />
                  <X className="h-5 w-5 hover:text-red-600 cursor-pointer" />
                  <Eye className="h-5 w-5 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-slate-50 dark:bg-slate-700"></div>

            {/* Read-only Fields */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Assigned by:
              </label>
              <div className="md:col-span-10 text-sm text-slate-600 dark:text-slate-400 font-medium">
                {formData.assigned_by}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Created at:
              </label>
              <div className="md:col-span-10 text-sm text-slate-600 dark:text-slate-400 font-medium">
                {formData.created_at ? new Date(formData.created_at).toLocaleString() : '-'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Updated at:
              </label>
              <div className="md:col-span-10 text-sm text-slate-600 dark:text-slate-400 font-medium">
                {formData.updated_at ? new Date(formData.updated_at).toLocaleString() : '-'}
              </div>
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              SAVE
            </button>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => saveTask('add_another')}
                className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              >
                Save and add another
              </button>
              <button
                type="button"
                onClick={() => saveTask('continue')}
                className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
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

export default TaskForm;

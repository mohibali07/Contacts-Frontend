import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Edit2, Plus, X, Eye, Search, ChevronRight, ChevronLeft } from 'lucide-react';

const TeamForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    lead: '',
    members: [] // Array of user IDs or names
  });

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]); // All available users
  
  // Dual Listbox States
  const [availableSearch, setAvailableSearch] = useState('');
  const [chosenSearch, setChosenSearch] = useState('');
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedChosen, setSelectedChosen] = useState([]);

  // Load data
  useEffect(() => {
    // Load Departments
    const savedDepts = localStorage.getItem('jira_departments');
    if (savedDepts) {
      setDepartmentOptions(JSON.parse(savedDepts).map(d => d.name));
    } else {
      setDepartmentOptions(['Development', 'HR', 'Designing']);
    }

    // Load Users for Lead and Members
    const savedUsers = localStorage.getItem('jira_users');
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      // Format: "username (Role)"
      const formattedUsers = users.map(u => ({
        id: u.id,
        label: `${u.username} (${u.role || 'No Role'})`,
        value: u.username
      }));
      setUserOptions(formattedUsers);
    } else {
      setUserOptions([
        { id: 1, label: 'admin (No Role)', value: 'admin' },
        { id: 2, label: 'syedaalin (Admin)', value: 'syedaalin' }
      ]);
    }

    // Load Team if editing
    if (isEdit) {
      const savedTeams = localStorage.getItem('jira_teams');
      if (savedTeams) {
        const teams = JSON.parse(savedTeams);
        const team = teams.find(t => t.id === parseInt(id));
        if (team) {
          setFormData({
            name: team.name || '',
            department: team.department || '',
            lead: team.lead || '',
            members: team.members || []
          });
        }
      }
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Dual Listbox Logic
  const availableMembers = userOptions.filter(u => !formData.members.includes(u.value));
  const chosenMembers = userOptions.filter(u => formData.members.includes(u.value));

  const filteredAvailable = availableMembers.filter(u => u.label.toLowerCase().includes(availableSearch.toLowerCase()));
  const filteredChosen = chosenMembers.filter(u => u.label.toLowerCase().includes(chosenSearch.toLowerCase()));

  const handleSelectAvailable = (value) => {
    if (selectedAvailable.includes(value)) {
      setSelectedAvailable(prev => prev.filter(v => v !== value));
    } else {
      setSelectedAvailable(prev => [...prev, value]);
    }
  };

  const handleSelectChosen = (value) => {
    if (selectedChosen.includes(value)) {
      setSelectedChosen(prev => prev.filter(v => v !== value));
    } else {
      setSelectedChosen(prev => [...prev, value]);
    }
  };

  const moveRight = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, ...selectedAvailable]
    }));
    setSelectedAvailable([]);
  };

  const moveLeft = () => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => !selectedChosen.includes(m))
    }));
    setSelectedChosen([]);
  };

  const moveAllRight = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, ...filteredAvailable.map(u => u.value)]
    }));
  };

  const moveAllLeft = () => {
    setFormData(prev => ({
      ...prev,
      members: [] // Or just remove filtered ones? Screenshot says "Remove all members"
    }));
  };

  const saveTeam = (redirectMode) => {
    const saved = localStorage.getItem('jira_teams');
    let teams = saved ? JSON.parse(saved) : [];
    let newId = null;

    const teamPayload = {
      name: formData.name,
      department: formData.department,
      lead: formData.lead,
      members: formData.members
    };

    if (isEdit) {
      teams = teams.map(t => t.id === parseInt(id) ? { ...t, ...teamPayload } : t);
    } else {
      newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
      teams.push({ id: newId, ...teamPayload });
    }

    localStorage.setItem('jira_teams', JSON.stringify(teams));

    // Handle Redirection
    if (redirectMode === 'list') {
      navigate('/teams');
    } else if (redirectMode === 'add_another') {
      setFormData({
        name: '',
        department: '',
        lead: '',
        members: []
      });
      if (isEdit) {
        navigate('/teams/add');
      }
    } else if (redirectMode === 'continue') {
      if (!isEdit && newId) {
        navigate(`/teams/edit/${newId}`, { replace: true });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveTeam('list');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 p-6 sm:p-10 font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/teams')}
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:shadow-sm"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isEdit ? 'Change team' : 'Add team'}
              </h1>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Name:
              </label>
              <div className="md:col-span-10">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  onChange={handleChange}
                  required
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium"
                />
              </div>
            </div>

            {/* Department */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Department:
              </label>
              <div className="md:col-span-10 flex items-center gap-3">
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
                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                  <Edit2 className="h-4 w-4 hover:text-blue-600 cursor-pointer" />
                  <Plus className="h-5 w-5 hover:text-green-600 cursor-pointer" />
                  <Eye className="h-5 w-5 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Lead */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Lead:
              </label>
              <div className="md:col-span-10 flex items-center gap-3">
                <select
                  name="lead"
                  value={formData.lead}
                  onChange={handleChange}
                  className="w-full max-w-md px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium cursor-pointer"
                >
                  <option value="">---------</option>
                  {userOptions.map(opt => (
                    <option key={opt.id} value={opt.value}>{opt.value}</option>
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

            {/* Members (Dual Listbox) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mt-8">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300 pt-2">
                Members:
              </label>
              <div className="md:col-span-10">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  
                  {/* Available Members */}
                  <div className="flex-1 w-full">
                    <div className="bg-slate-900 text-white px-3 py-2 text-xs font-bold rounded-t-lg">
                      Available members
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-t-0 p-3 text-xs text-slate-500 dark:text-slate-400 h-16">
                      Choose members by selecting them and then select the "Choose" arrow button.
                    </div>
                    <div className="border border-slate-200 dark:border-slate-700 border-t-0 bg-white dark:bg-slate-900 p-2">
                      <div className="relative mb-2">
                        <Search className="absolute left-2 top-1.5 h-4 w-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Filter" 
                          value={availableSearch}
                          onChange={(e) => setAvailableSearch(e.target.value)}
                          className="w-full pl-8 pr-2 py-1 text-sm bg-slate-900 text-white rounded border border-slate-700 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="h-48 overflow-y-auto border border-slate-200 rounded bg-white">
                        {filteredAvailable.map(u => (
                          <div 
                            key={u.id}
                            onClick={() => handleSelectAvailable(u.value)}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 ${selectedAvailable.includes(u.value) ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                          >
                            {u.label}
                          </div>
                        ))}
                      </div>
                      <button 
                        type="button"
                        onClick={moveAllRight}
                        className="mt-2 text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        Choose all members <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col gap-2">
                    <button 
                      type="button"
                      onClick={moveRight}
                      className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                      title="Add selected"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <button 
                      type="button"
                      onClick={moveLeft}
                      className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                      title="Remove selected"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Chosen Members */}
                  <div className="flex-1 w-full">
                    <div className="bg-blue-600 text-white px-3 py-2 text-xs font-bold rounded-t-lg flex justify-between items-center">
                      <span>Chosen members</span>
                      <Plus className="h-4 w-4 cursor-pointer hover:text-blue-200" />
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 border-t-0 p-3 text-xs text-blue-800 dark:text-blue-300 h-16">
                      Remove members by selecting them and then select the "Remove" arrow button.
                    </div>
                    <div className="border border-slate-200 dark:border-slate-700 border-t-0 bg-white dark:bg-slate-900 p-2">
                      <div className="relative mb-2">
                        <Search className="absolute left-2 top-1.5 h-4 w-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Filter" 
                          value={chosenSearch}
                          onChange={(e) => setChosenSearch(e.target.value)}
                          className="w-full pl-8 pr-2 py-1 text-sm bg-slate-900 text-white rounded border border-slate-700 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="h-48 overflow-y-auto border border-slate-200 rounded bg-white">
                        {filteredChosen.map(u => (
                          <div 
                            key={u.id}
                            onClick={() => handleSelectChosen(u.value)}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 ${selectedChosen.includes(u.value) ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                          >
                            {u.label}
                          </div>
                        ))}
                      </div>
                      <button 
                        type="button"
                        onClick={moveAllLeft}
                        className="mt-2 text-xs font-bold text-slate-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <ChevronLeft className="h-3 w-3" /> Remove all members
                      </button>
                    </div>
                  </div>

                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Hold down "Control", or "Command" on a Mac, to select more than one.
                </p>
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
              SAVE
            </button>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => saveTeam('add_another')}
                className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              >
                Save and add another
              </button>
              <button
                type="button"
                onClick={() => saveTeam('continue')}
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

export default TeamForm;

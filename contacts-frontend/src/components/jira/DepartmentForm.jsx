import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit2, X, Eye, Save, ArrowLeft, Trash2 } from 'lucide-react';

const DepartmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: ''
  });

  const [allDepartments, setAllDepartments] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  
  // Modal State
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [parentFormName, setParentFormName] = useState('');
  const [editingParentOriginalName, setEditingParentOriginalName] = useState('');

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem('jira_departments');
    let departments = [];
    if (saved) {
      departments = JSON.parse(saved);
    } else {
      departments = [
        { id: 1, name: 'Designing', parent: '-', main_branch: 'Designing' },
        { id: 2, name: 'backend', parent: 'Development', main_branch: 'Development' },
        { id: 3, name: 'Frontend', parent: 'Development', main_branch: 'Development' },
        { id: 4, name: 'Development', parent: '-', main_branch: 'Development' },
      ];
      localStorage.setItem('jira_departments', JSON.stringify(departments));
    }

    setAllDepartments(departments);
    const options = [...new Set(departments.map(d => d.name))];
    setParentOptions(options);

    if (isEdit) {
      const dept = departments.find(d => d.id === parseInt(id));
      if (dept) {
        setFormData({
          name: dept.name,
          description: dept.description || '',
          parent: dept.parent === '-' ? '' : dept.parent
        });
      }
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveDepartment = (redirectMode) => {
    // Refresh data from local storage
    const saved = localStorage.getItem('jira_departments');
    let departments = saved ? JSON.parse(saved) : [];
    let newId = null;

    if (isEdit) {
      departments = departments.map(d => 
        d.id === parseInt(id) 
          ? { ...d, ...formData, parent: formData.parent || '-', main_branch: formData.parent || formData.name } 
          : d
      );
    } else {
      newId = departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1;
      const newDept = {
        id: newId,
        name: formData.name,
        description: formData.description,
        parent: formData.parent || '-',
        main_branch: formData.parent || formData.name
      };
      departments.push(newDept);
    }

    localStorage.setItem('jira_departments', JSON.stringify(departments));
    setAllDepartments(departments);
    setParentOptions([...new Set(departments.map(d => d.name))]);

    // Handle Redirection
    if (redirectMode === 'list') {
      navigate('/departments');
    } else if (redirectMode === 'add_another') {
      // Reset form for new entry
      setFormData({
        name: '',
        description: '',
        parent: '' // Or keep the parent? Usually reset is better unless requested otherwise.
      });
      if (isEdit) {
        navigate('/departments/add');
      }
      // If already in add mode, just clearing state is enough, but we might want to show a success toast in future
    } else if (redirectMode === 'continue') {
      if (!isEdit && newId) {
        // If we just created a new one, navigate to its edit page
        navigate(`/departments/edit/${newId}`, { replace: true });
      }
      // If already editing, do nothing (just saved)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveDepartment('list');
  };

  // --- Parent Action Handlers ---

  const handleOpenAddParent = () => {
    setModalMode('add');
    setParentFormName('');
    setIsParentModalOpen(true);
  };

  const handleOpenEditParent = () => {
    if (!formData.parent) return;
    setModalMode('edit');
    setParentFormName(formData.parent);
    setEditingParentOriginalName(formData.parent);
    setIsParentModalOpen(true);
  };

  const handleViewParent = () => {
    if (!formData.parent) return;
    const parentDept = allDepartments.find(d => d.name === formData.parent);
    if (parentDept) {
      navigate(`/departments/edit/${parentDept.id}`);
    } else {
      alert('Parent department record not found.');
    }
  };

  const handleDeleteParent = () => {
    setFormData(prev => ({ ...prev, parent: '' }));
  };
  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!parentFormName.trim()) return;

    const newName = parentFormName.trim();
    let updatedDepartments = [...allDepartments];

    if (modalMode === 'add') {
      if (updatedDepartments.some(d => d.name.toLowerCase() === newName.toLowerCase())) {
        alert('Department already exists!');
        return;
      }
      const newId = updatedDepartments.length > 0 ? Math.max(...updatedDepartments.map(d => d.id)) + 1 : 1;
      const newDept = {
        id: newId,
        name: newName,
        description: 'Created via Quick Add',
        parent: '-',
        main_branch: newName
      };
      updatedDepartments.push(newDept);
      setFormData(prev => ({ ...prev, parent: newName }));

    } else if (modalMode === 'edit') {
      const originalName = editingParentOriginalName;
      updatedDepartments = updatedDepartments.map(d => 
        d.name === originalName ? { ...d, name: newName } : d
      );
      updatedDepartments = updatedDepartments.map(d => 
        d.parent === originalName ? { ...d, parent: newName } : d
      );
      setFormData(prev => ({ ...prev, parent: newName }));
    }

    localStorage.setItem('jira_departments', JSON.stringify(updatedDepartments));
    setAllDepartments(updatedDepartments);
    setParentOptions([...new Set(updatedDepartments.map(d => d.name))]);
    
    setIsParentModalOpen(false);
    setParentFormName('');
  };

  const isParentSelected = !!formData.parent;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 p-6 sm:p-10 font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/departments')}
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:shadow-sm"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isEdit ? 'Edit Department' : 'Add Department'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
                {isEdit ? 'Update department details and hierarchy.' : 'Create a new department in the organization.'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Name Field */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 dark:text-slate-300 pt-3">
                Department Name
              </label>
              <div className="md:col-span-9">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Engineering"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium"
                />
                <p className="mt-2 text-xs text-slate-400">The name of the department as it will appear in reports.</p>
              </div>
            </div>

            <div className="w-full h-px bg-slate-50 dark:bg-slate-700"></div>

            {/* Description Field */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 dark:text-slate-300 pt-3">
                Description
              </label>
              <div className="md:col-span-9">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Brief description of the department's responsibilities..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium resize-y"
                />
              </div>
            </div>

            <div className="w-full h-px bg-slate-50 dark:bg-slate-700"></div>

            {/* Parent Field */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-3 text-sm font-bold text-slate-700 dark:text-slate-300 pt-3">
                Parent Department
              </label>
              <div className="md:col-span-9">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-md">
                    <select
                      name="parent"
                      value={formData.parent}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="">None (Top Level)</option>
                      {parentOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button 
                      type="button" 
                      onClick={handleOpenEditParent}
                      disabled={!isParentSelected}
                      className={`p-2 rounded-md transition-all shadow-sm ${
                        isParentSelected 
                          ? 'hover:bg-white hover:text-blue-600 hover:shadow text-slate-500' 
                          : 'text-slate-300 cursor-not-allowed'
                      }`}
                      title="Edit Selected Parent"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button 
                      type="button" 
                      onClick={handleOpenAddParent}
                      className="p-2 hover:bg-white hover:text-green-600 rounded-md transition-all shadow-sm hover:shadow text-slate-500" 
                      title="Add New Parent"
                    >
                      <Plus className="h-4 w-4" />
                    </button>

                    <button 
                      type="button" 
                      onClick={handleViewParent}
                      disabled={!isParentSelected}
                      className={`p-2 rounded-md transition-all shadow-sm ${
                        isParentSelected 
                          ? 'hover:bg-white hover:text-slate-800 hover:shadow text-slate-500' 
                          : 'text-slate-300 cursor-not-allowed'
                      }`}
                      title="View Selected Parent"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button 
                      type="button" 
                      onClick={handleDeleteParent}
                      disabled={!isParentSelected}
                      className={`p-2 rounded-md transition-all shadow-sm ${
                        isParentSelected 
                          ? 'hover:bg-white hover:text-red-600 hover:shadow text-slate-500' 
                          : 'text-slate-300 cursor-not-allowed'
                      }`}
                      title="Delete Selected Parent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-400">Select a parent department if this is a sub-department.</p>
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
              Save Department
            </button>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => saveDepartment('add_another')}
                className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              >
                Save and add another
              </button>
              <button
                type="button"
                onClick={() => saveDepartment('continue')}
                className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              >
                Save and continue editing
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Add/Edit Parent Modal */}
      {isParentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900">
                {modalMode === 'add' ? 'Add New Department' : 'Edit Parent Department'}
              </h3>
              <button 
                onClick={() => setIsParentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={parentFormName}
                  onChange={(e) => setParentFormName(e.target.value)}
                  placeholder="e.g. Operations"
                  autoFocus
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsParentModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!parentFormName.trim()}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                >
                  {modalMode === 'add' ? 'Save & Select' : 'Update Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentForm;

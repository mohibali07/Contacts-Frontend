import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Edit2, Plus, Eye } from 'lucide-react';

const TaskSubmissionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    task: '',
    submission_note: '',
    submission_file: null,
    submitted_by: 'syedaalin (Admin)', // Mock
    created_at: ''
  });

  const [taskOptions, setTaskOptions] = useState([]);

  // Load data
  useEffect(() => {
    // Load Tasks
    const savedTasks = localStorage.getItem('jira_tasks');
    if (savedTasks) {
      setTaskOptions(JSON.parse(savedTasks).map(t => ({
        id: t.id,
        label: t.title,
        value: t.title
      })));
    } else {
      setTaskOptions([{ id: 1, label: 'jira test', value: 'jira test' }]);
    }

    // Load Submission if editing
    if (isEdit) {
      const savedSubmissions = localStorage.getItem('jira_task_submissions');
      if (savedSubmissions) {
        const submissions = JSON.parse(savedSubmissions);
        const submission = submissions.find(s => s.id === parseInt(id));
        if (submission) {
          setFormData(submission);
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        created_at: new Date().toISOString()
      }));
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // In a real app we'd upload this. For now we just store the name.
    if (file) {
      setFormData(prev => ({ ...prev, submission_file: file.name }));
    }
  };

  const saveSubmission = (redirectMode) => {
    const saved = localStorage.getItem('jira_task_submissions');
    let submissions = saved ? JSON.parse(saved) : [];
    let newId = null;

    const submissionPayload = {
      ...formData,
      // Ensure we keep the file name if it wasn't changed
    };

    if (isEdit) {
      submissions = submissions.map(s => s.id === parseInt(id) ? { ...s, ...submissionPayload } : s);
    } else {
      newId = submissions.length > 0 ? Math.max(...submissions.map(s => s.id)) + 1 : 1;
      submissions.push({ id: newId, ...submissionPayload });
    }

    localStorage.setItem('jira_task_submissions', JSON.stringify(submissions));

    // Handle Redirection
    if (redirectMode === 'list') {
      navigate('/task-submissions');
    } else if (redirectMode === 'add_another') {
      setFormData({
        task: '',
        submission_note: '',
        submission_file: null,
        submitted_by: 'syedaalin (Admin)',
        created_at: new Date().toISOString()
      });
      if (isEdit) {
        navigate('/task-submissions/add');
      }
    } else if (redirectMode === 'continue') {
      if (!isEdit && newId) {
        navigate(`/task-submissions/edit/${newId}`, { replace: true });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSubmission('list');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 p-6 sm:p-10 font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/task-submissions')}
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:shadow-sm"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isEdit ? 'Change task submission' : 'Add task submission'}
              </h1>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Task */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Task:
              </label>
              <div className="md:col-span-10 flex items-center gap-3">
                <select
                  name="task"
                  value={formData.task}
                  onChange={handleChange}
                  className="w-full max-w-xs px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium cursor-pointer"
                >
                  <option value="">---------</option>
                  {taskOptions.map(opt => (
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

            {/* Submission Note */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300 pt-3">
                Submission note:
              </label>
              <div className="md:col-span-10">
                <textarea
                  name="submission_note"
                  value={formData.submission_note}
                  onChange={handleChange}
                  rows={5}
                  className="w-full max-w-2xl px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all font-medium resize-y"
                />
              </div>
            </div>

            {/* Submission File */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <label className="md:col-span-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                Submission file:
              </label>
              <div className="md:col-span-10 flex items-center gap-2">
                <label className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                  Choose File
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {formData.submission_file ? formData.submission_file : 'No file chosen'}
                </span>
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
                onClick={() => saveSubmission('add_another')}
                className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              >
                Save and add another
              </button>
              <button
                type="button"
                onClick={() => saveSubmission('continue')}
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

export default TaskSubmissionForm;

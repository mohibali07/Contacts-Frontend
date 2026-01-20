import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericList from './GenericList';

const INITIAL_MOCK_SUBMISSIONS = [
  { 
    id: 1, 
    task: 'jira test', 
    submitted_by: 'syedaalin (Admin)', 
    submission_note: '-', 
    created_at: '2026-01-17T10:47:00' 
  },
];

const TaskSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('jira_task_submissions');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_SUBMISSIONS;
  });

  const [selectedCreatedAt, setSelectedCreatedAt] = useState('Any date');
  const [selectedPriority, setSelectedPriority] = useState([]); // Note: Priority isn't in the list columns but is in the filter sidebar in the screenshot

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jira_task_submissions', JSON.stringify(submissions));
  }, [submissions]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }).replace(',', '');
  };

  const columns = [
    { 
      header: 'TASK', 
      accessor: 'task', 
      render: (item) => (
        <span className="font-bold text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/jira/task-submissions/edit/${item.id}`)}>
          {item.task}
        </span>
      )
    },
    { 
      header: 'SUBMITTED BY', 
      accessor: 'submitted_by',
      render: (item) => (
        <span className="text-slate-700">{item.submitted_by || '-'}</span>
      )
    },
    { 
      header: 'SUBMISSION NOTE', 
      accessor: 'submission_note',
      render: (item) => (
        <span className="text-slate-700">{item.submission_note || '-'}</span>
      )
    },
    { 
      header: 'CREATED AT', 
      accessor: 'created_at',
      render: (item) => (
        <span className="text-slate-700">{formatDate(item.created_at)}</span>
      )
    },
  ];

  // Filter Logic
  const filteredData = useMemo(() => {
    return submissions.filter(item => {
      // Priority filter logic would go here if we had priority in the submission data. 
      // Assuming we might need to look up the task's priority, but for now we'll just implement the UI.
      const priorityMatch = selectedPriority.length === 0 || selectedPriority.includes('All'); 
      
      let dateMatch = true;
      if (selectedCreatedAt !== 'Any date') {
        const date = new Date(item.created_at);
        const today = new Date();
        if (selectedCreatedAt === 'Today') {
          dateMatch = date.toDateString() === today.toDateString();
        } else if (selectedCreatedAt === 'This month') {
          dateMatch = date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        } else if (selectedCreatedAt === 'This year') {
          dateMatch = date.getFullYear() === today.getFullYear();
        }
      }

      return priorityMatch && dateMatch;
    });
  }, [submissions, selectedCreatedAt, selectedPriority]);

  const handleFilterChange = (setter, current, value) => {
    setter(prev => {
      if (value === 'All') return [];
      if (prev.includes(value)) return prev.filter(v => v !== value);
      return [...prev, value];
    });
  };

  const filterContent = (
    <div className="space-y-6">
      {/* By Created At */}
      <div>
        <label className="block text-xs font-bold text-blue-400 uppercase mb-2 flex items-center gap-1">
          <span className="text-blue-500">↓</span> By created at
        </label>
        <div className="space-y-1 pl-2">
          {['Any date', 'Today', 'Past 7 days', 'This month', 'This year'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer group">
              <span className={`text-sm ${selectedCreatedAt === option ? 'font-bold text-slate-900' : 'text-slate-600'} group-hover:text-slate-900 transition-colors`}>
                <input 
                  type="radio" 
                  name="created_at_filter"
                  className="hidden"
                  checked={selectedCreatedAt === option}
                  onChange={() => setSelectedCreatedAt(option)}
                />
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* By Priority */}
      <div>
        <label className="block text-xs font-bold text-blue-400 uppercase mb-2 flex items-center gap-1">
          <span className="text-blue-500">↓</span> By priority
        </label>
        <div className="space-y-1 pl-2">
          {['All', 'Low', 'Medium', 'High', 'Critical'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer group">
              <span className={`text-sm ${selectedPriority.includes(option) ? 'font-bold text-slate-900' : 'text-slate-600'} group-hover:text-slate-900 transition-colors`}>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={selectedPriority.includes(option)}
                  onChange={() => handleFilterChange(setSelectedPriority, selectedPriority, option)}
                />
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <GenericList
      title="Select task submission to change"
      subtitle=""
      columns={columns}
      data={filteredData}
      onAdd={() => navigate('/jira/task-submissions/add')}
      onEdit={(item) => navigate(`/jira/task-submissions/edit/${item.id}`)}
      onDelete={(item) => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
          const newSubmissions = submissions.filter(s => s.id !== item.id);
          setSubmissions(newSubmissions);
        }
      }}
      filterContent={filterContent}
      onResetFilters={() => {
        setSelectedCreatedAt('Any date');
        setSelectedPriority([]);
      }}
    />
  );
};

export default TaskSubmissions;

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericList from './GenericList';

const INITIAL_MOCK_TASKS = [
  { 
    id: 1, 
    title: 'jira test', 
    assigned_to: 'Ahmed Ali (Admin)', 
    priority: 'Medium', 
    status: 'Completed', 
    deadline: '2026-01-20', 
    assigned_by: 'Admin (admin)' 
  },
];

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('jira_tasks');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_TASKS;
  });

  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState([]);
  const [selectedDeadline, setSelectedDeadline] = useState('Any date');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jira_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'text-red-600 font-bold';
      case 'high': return 'text-orange-500 font-bold';
      case 'medium': return 'text-blue-600 font-bold';
      case 'low': return 'text-green-600 font-bold';
      default: return 'text-slate-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600 font-bold';
      case 'in progress': return 'text-blue-600 font-bold';
      case 'pending': return 'text-orange-500 font-bold';
      case 'overdue': return 'text-red-600 font-bold';
      default: return 'text-slate-600';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const columns = [
    { 
      header: 'TITLE', 
      accessor: 'title', 
      render: (item) => (
        <span className="font-bold text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/jira/tasks/edit/${item.id}`)}>
          {item.title}
        </span>
      )
    },
    { 
      header: 'ASSIGNED TO COLORED', 
      accessor: 'assigned_to',
      render: (item) => (
        <span className="text-slate-700">{item.assigned_to || '-'}</span>
      )
    },
    { 
      header: 'PRIORITY COLORED', 
      accessor: 'priority',
      render: (item) => (
        <span className={getPriorityColor(item.priority)}>{item.priority || '-'}</span>
      )
    },
    { 
      header: 'STATUS COLORED', 
      accessor: 'status',
      render: (item) => (
        <span className={getStatusColor(item.status)}>{item.status || '-'}</span>
      )
    },
    { 
      header: 'DEADLINE', 
      accessor: 'deadline',
      render: (item) => (
        <span className="text-slate-700">{formatDate(item.deadline)}</span>
      )
    },
    { 
      header: 'ASSIGNED BY', 
      accessor: 'assigned_by',
      render: (item) => (
        <span className="text-slate-700">{item.assigned_by || '-'}</span>
      )
    },
  ];

  // Filter Logic
  const filteredData = useMemo(() => {
    return tasks.filter(item => {
      const statusMatch = selectedStatus.length === 0 || selectedStatus.includes('All') || selectedStatus.includes(item.status);
      const priorityMatch = selectedPriority.length === 0 || selectedPriority.includes('All') || selectedPriority.includes(item.priority);
      
      let deadlineMatch = true;
      if (selectedDeadline !== 'Any date') {
        const date = new Date(item.deadline);
        const today = new Date();
        // Simplified logic for demo
        if (selectedDeadline === 'Today') {
          deadlineMatch = date.toDateString() === today.toDateString();
        } else if (selectedDeadline === 'This month') {
          deadlineMatch = date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        } else if (selectedDeadline === 'This year') {
          deadlineMatch = date.getFullYear() === today.getFullYear();
        }
      }

      return statusMatch && priorityMatch && deadlineMatch;
    });
  }, [tasks, selectedStatus, selectedPriority, selectedDeadline]);

  const handleFilterChange = (setter, current, value) => {
    setter(prev => {
      if (value === 'All') return [];
      if (prev.includes(value)) return prev.filter(v => v !== value);
      return [...prev, value];
    });
  };

  const filterContent = (
    <div className="space-y-6">
      {/* By Status */}
      <div>
        <label className="block text-xs font-bold text-blue-400 uppercase mb-2 flex items-center gap-1">
          <span className="text-blue-500">↓</span> By status
        </label>
        <div className="space-y-1 pl-2">
          {['All', 'Pending', 'In Progress', 'Completed', 'Overdue'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer group">
              <span className={`text-sm ${selectedStatus.includes(option) ? 'font-bold text-slate-900' : 'text-slate-600'} group-hover:text-slate-900 transition-colors`}>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={selectedStatus.includes(option)}
                  onChange={() => handleFilterChange(setSelectedStatus, selectedStatus, option)}
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

      {/* By Deadline */}
      <div>
        <label className="block text-xs font-bold text-blue-400 uppercase mb-2 flex items-center gap-1">
          <span className="text-blue-500">↓</span> By deadline
        </label>
        <div className="space-y-1 pl-2">
          {['Any date', 'Today', 'Past 7 days', 'This month', 'This year'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer group">
              <span className={`text-sm ${selectedDeadline === option ? 'font-bold text-slate-900' : 'text-slate-600'} group-hover:text-slate-900 transition-colors`}>
                <input 
                  type="radio" 
                  name="deadline_filter"
                  className="hidden"
                  checked={selectedDeadline === option}
                  onChange={() => setSelectedDeadline(option)}
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
      title="Select task to change"
      subtitle=""
      columns={columns}
      data={filteredData}
      onAdd={() => navigate('/jira/tasks/add')}
      onEdit={(item) => navigate(`/jira/tasks/edit/${item.id}`)}
      onDelete={(item) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
          const newTasks = tasks.filter(t => t.id !== item.id);
          setTasks(newTasks);
        }
      }}
      filterContent={filterContent}
      onResetFilters={() => {
        setSelectedStatus([]);
        setSelectedPriority([]);
        setSelectedDeadline('Any date');
      }}
    />
  );
};

export default Tasks;

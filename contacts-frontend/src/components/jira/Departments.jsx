import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericList from './GenericList';

const INITIAL_MOCK_DEPARTMENTS = [
  { id: 1, name: 'Designing', parent: '-', main_branch: 'Designing' },
  { id: 2, name: 'backend', parent: 'Development', main_branch: 'Development' },
  { id: 3, name: 'Frontend', parent: 'Development', main_branch: 'Development' },
  { id: 4, name: 'Development', parent: '-', main_branch: 'Development' },
];

const Departments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('jira_departments');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_DEPARTMENTS;
  });
  
  const [selectedParents, setSelectedParents] = useState([]);

  // Save to localStorage whenever departments change
  useEffect(() => {
    localStorage.setItem('jira_departments', JSON.stringify(departments));
  }, [departments]);

  const columns = [
    { 
      header: 'Department Name', 
      accessor: 'name', 
      render: (item) => (
        <span className="font-semibold text-slate-800">{item.name}</span>
      )
    },
    { 
      header: 'Parent Department', 
      accessor: 'parent',
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          !item.parent || item.parent === '-' 
            ? 'bg-slate-100 text-slate-600' 
            : 'bg-blue-50 text-blue-700'
        }`}>
          {item.parent || '-'}
        </span>
      )
    },
    { header: 'Main Branch', accessor: 'main_branch' },
  ];

  // Dynamically generate parent options from data
  const parentOptions = useMemo(() => {
    // Get all unique parent values from departments
    const parents = new Set(departments.map(d => d.parent || '-'));
    // Also include department names themselves, as they can be parents
    // But usually filters show what is currently being used as a parent.
    // Let's stick to what is actually used as a parent in the data + the departments themselves if we want to filter by "Potential Parent"?
    // The user said "options aane chahiye jo department ma added hain" -> likely means filter by existing parents.
    // Let's collect all unique values in the 'parent' column.
    return ['All', ...Array.from(parents).filter(p => p !== 'All').sort()];
  }, [departments]);

  // Filter Logic
  const filteredData = useMemo(() => {
    if (selectedParents.length === 0 || selectedParents.includes('All')) {
      return departments;
    }
    return departments.filter(item => selectedParents.includes(item.parent || '-'));
  }, [departments, selectedParents]);

  const handleParentFilterChange = (parent) => {
    setSelectedParents(prev => {
      if (parent === 'All') return []; // Reset if All is clicked
      
      if (prev.includes(parent)) {
        return prev.filter(p => p !== parent);
      } else {
        return [...prev, parent];
      }
    });
  };

  const filterContent = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Parent Department</label>
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
          {parentOptions.map((option) => (
            <label key={option} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={option === 'All' ? selectedParents.length === 0 : selectedParents.includes(option)}
                  onChange={() => handleParentFilterChange(option)}
                  className="peer h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" 
                />
              </div>
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                {option === '-' ? 'None (Top Level)' : option}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <GenericList
      title="Departments"
      subtitle="Manage your organization's department structure and hierarchy."
      columns={columns}
      data={filteredData}
      onAdd={() => navigate('/jira/departments/add')}
      onEdit={(item) => navigate(`/jira/departments/edit/${item.id}`)}
      onDelete={(item) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
          const newDepts = departments.filter(d => d.id !== item.id);
          setDepartments(newDepts);
        }
      }}
      filterContent={filterContent}
      onResetFilters={() => setSelectedParents([])}
    />
  );
};

export default Departments;

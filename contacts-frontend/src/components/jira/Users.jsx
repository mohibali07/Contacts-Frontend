import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericList from './GenericList';
import { CheckCircle2, XCircle } from 'lucide-react';

const INITIAL_MOCK_USERS = [
  { id: 1, username: 'admin', role: '-', department: '-', staff_status: true },
  { id: 2, username: 'syedaalin', role: 'Admin', department: 'Development', staff_status: true },
];

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('jira_users');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_USERS;
  });

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedStaffStatus, setSelectedStaffStatus] = useState([]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jira_users', JSON.stringify(users));
  }, [users]);

  const columns = [
    { 
      header: 'USERNAME', 
      accessor: 'username', 
      render: (item) => (
        <span className="font-bold text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/users/edit/${item.id}`)}>
          {item.username}
        </span>
      )
    },
    { 
      header: 'ROLE', 
      accessor: 'role',
      render: (item) => (
        <span className="text-slate-700">{item.role || '-'}</span>
      )
    },
    { 
      header: 'DEPARTMENT', 
      accessor: 'department',
      render: (item) => (
        <span className="text-slate-700">{item.department || '-'}</span>
      )
    },
    { 
      header: 'STAFF STATUS', 
      accessor: 'staff_status',
      render: (item) => (
        item.staff_status ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )
      )
    },
  ];

  // Dynamic Filter Options
  const roleOptions = useMemo(() => {
    const roles = new Set(users.map(u => u.role).filter(r => r && r !== '-'));
    return ['All', ...Array.from(roles).sort(), '-'];
  }, [users]);

  const departmentOptions = useMemo(() => {
    const depts = new Set(users.map(u => u.department).filter(d => d && d !== '-'));
    return ['All', ...Array.from(depts).sort(), '-'];
  }, [users]);

  const staffStatusOptions = ['All', 'Yes', 'No'];

  // Filter Logic
  const filteredData = useMemo(() => {
    return users.filter(item => {
      const roleMatch = selectedRoles.length === 0 || selectedRoles.includes('All') || selectedRoles.includes(item.role || '-');
      const deptMatch = selectedDepartments.length === 0 || selectedDepartments.includes('All') || selectedDepartments.includes(item.department || '-');
      const statusMatch = selectedStaffStatus.length === 0 || selectedStaffStatus.includes('All') || 
        (selectedStaffStatus.includes('Yes') && item.staff_status) || 
        (selectedStaffStatus.includes('No') && !item.staff_status);
      
      return roleMatch && deptMatch && statusMatch;
    });
  }, [users, selectedRoles, selectedDepartments, selectedStaffStatus]);

  const handleFilterChange = (setter, current, value) => {
    setter(prev => {
      if (value === 'All') return [];
      if (prev.includes(value)) return prev.filter(v => v !== value);
      return [...prev, value];
    });
  };

  const filterContent = (
    <div className="space-y-6">
      {/* By Role */}
      <div>
        <label className="block text-xs font-bold text-blue-400 uppercase mb-2 flex items-center gap-1">
          <span className="text-blue-500">↓</span> By role
        </label>
        <div className="space-y-1 pl-2">
          {roleOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer group">
              <span className={`text-sm ${selectedRoles.includes(option) ? 'font-bold text-slate-900' : 'text-slate-600'} group-hover:text-slate-900 transition-colors`}>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={selectedRoles.includes(option)}
                  onChange={() => handleFilterChange(setSelectedRoles, selectedRoles, option)}
                />
                {option === '-' ? '-' : option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* By Department */}
      <div>
        <label className="block text-xs font-bold text-blue-400 uppercase mb-2 flex items-center gap-1">
          <span className="text-blue-500">↓</span> By department
        </label>
        <div className="space-y-1 pl-2">
          {departmentOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer group">
              <span className={`text-sm ${selectedDepartments.includes(option) ? 'font-bold text-slate-900' : 'text-slate-600'} group-hover:text-slate-900 transition-colors`}>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={selectedDepartments.includes(option)}
                  onChange={() => handleFilterChange(setSelectedDepartments, selectedDepartments, option)}
                />
                {option === '-' ? '-' : option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* By Staff Status */}
      <div>
        <label className="block text-xs font-bold text-blue-400 uppercase mb-2 flex items-center gap-1">
          <span className="text-blue-500">↓</span> By staff status
        </label>
        <div className="space-y-1 pl-2">
          {staffStatusOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer group">
              <span className={`text-sm ${selectedStaffStatus.includes(option) ? 'font-bold text-slate-900' : 'text-slate-600'} group-hover:text-slate-900 transition-colors`}>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={selectedStaffStatus.includes(option)}
                  onChange={() => handleFilterChange(setSelectedStaffStatus, selectedStaffStatus, option)}
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
      title="Select user to change"
      subtitle=""
      columns={columns}
      data={filteredData}
      onAdd={() => navigate('/users/add')}
      onEdit={(item) => navigate(`/users/edit/${item.id}`)}
      onDelete={(item) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
          const newUsers = users.filter(u => u.id !== item.id);
          setUsers(newUsers);
        }
      }}
      filterContent={filterContent}
      onResetFilters={() => {
        setSelectedRoles([]);
        setSelectedDepartments([]);
        setSelectedStaffStatus([]);
      }}
    />
  );
};

export default Users;

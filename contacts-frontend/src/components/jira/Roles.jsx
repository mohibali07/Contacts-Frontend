import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericList from './GenericList';

const INITIAL_MOCK_ROLES = [
  { id: 1, name: 'employ', description: '-' },
  { id: 2, name: 'Team Lead', description: '-' },
  { id: 3, name: 'manager', description: '-' },
  { id: 4, name: 'Admin', description: '-' },
];

const Roles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(() => {
    const saved = localStorage.getItem('jira_roles');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_ROLES;
  });
  
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jira_roles', JSON.stringify(roles));
  }, [roles]);

  const columns = [
    { 
      header: 'Name', 
      accessor: 'name', 
      render: (item) => (
        <span className="font-semibold text-slate-800">{item.name}</span>
      )
    },
    { 
      header: 'Description', 
      accessor: 'description',
      render: (item) => (
        <span className="text-slate-600">{item.description || '-'}</span>
      )
    },
  ];

  return (
    <GenericList
      title="Select role to change"
      subtitle="" // Screenshot doesn't have a subtitle, but GenericList might expect one. Leaving empty or minimal.
      columns={columns}
      data={roles}
      onAdd={() => navigate('/jira/roles/add')}
      onEdit={(item) => navigate(`/jira/roles/edit/${item.id}`)}
      onDelete={(item) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
          const newRoles = roles.filter(r => r.id !== item.id);
          setRoles(newRoles);
        }
      }}
      // No filters shown in screenshot for now, keeping it simple
    />
  );
};

export default Roles;

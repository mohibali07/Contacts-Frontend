import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericList from './GenericList';

const INITIAL_MOCK_TEAMS = [
  // Empty initially as per screenshot, or maybe add one for demo
];

const Teams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('jira_teams');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_TEAMS;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jira_teams', JSON.stringify(teams));
  }, [teams]);

  const columns = [
    { 
      header: 'NAME', 
      accessor: 'name', 
      render: (item) => (
        <span className="font-bold text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/jira/teams/edit/${item.id}`)}>
          {item.name}
        </span>
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
      header: 'LEAD', 
      accessor: 'lead',
      render: (item) => (
        <span className="text-slate-700">{item.lead || '-'}</span>
      )
    },
  ];

  return (
    <GenericList
      title="Select team to change"
      subtitle=""
      columns={columns}
      data={teams}
      onAdd={() => navigate('/jira/teams/add')}
      onEdit={(item) => navigate(`/jira/teams/edit/${item.id}`)}
      onDelete={(item) => {
        if (window.confirm('Are you sure you want to delete this team?')) {
          const newTeams = teams.filter(t => t.id !== item.id);
          setTeams(newTeams);
        }
      }}
      // No specific filters shown in screenshot, keeping it simple
    />
  );
};

export default Teams;

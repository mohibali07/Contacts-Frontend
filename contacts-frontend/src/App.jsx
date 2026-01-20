import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Departments from './components/jira/Departments';
import DepartmentForm from './components/jira/DepartmentForm';
import Roles from './components/jira/Roles';
import RoleForm from './components/jira/RoleForm';
import TaskSubmissions from './components/jira/TaskSubmissions';
import TaskSubmissionForm from './components/jira/TaskSubmissionForm';
import Tasks from './components/jira/Tasks';
import TaskForm from './components/jira/TaskForm';
import Teams from './components/jira/Teams';
import TeamForm from './components/jira/TeamForm';
import Users from './components/jira/Users';
import UserForm from './components/jira/UserForm';

// Simple Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          {/* Jira Routes */}
          {/* Jira Routes */}
          <Route path="departments" element={<Departments />} />
          <Route path="departments/add" element={<DepartmentForm />} />
          <Route path="departments/edit/:id" element={<DepartmentForm />} />
          
          <Route path="roles" element={<Roles />} />
          <Route path="roles/add" element={<RoleForm />} />
          <Route path="roles/edit/:id" element={<RoleForm />} />
          
          <Route path="task-submissions" element={<TaskSubmissions />} />
          <Route path="task-submissions/add" element={<TaskSubmissionForm />} />
          <Route path="task-submissions/edit/:id" element={<TaskSubmissionForm />} />
          
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/add" element={<TaskForm />} />
          <Route path="tasks/edit/:id" element={<TaskForm />} />
          
          <Route path="teams" element={<Teams />} />
          <Route path="teams/add" element={<TeamForm />} />
          <Route path="teams/edit/:id" element={<TeamForm />} />
          
          <Route path="users" element={<Users />} />
          <Route path="users/add" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />
          
          <Route path="settings" element={<div className="text-2xl font-bold text-gray-800">Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

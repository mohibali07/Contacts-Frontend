import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import ContactList from './components/contacts/ContactList';
import ContactForm from './components/contacts/ContactForm';
import PlaceholderPage from './components/PlaceholderPage';
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
          <Route path="dashboard" element={<div className="text-2xl font-bold text-gray-800">Dashboard Overview</div>} />
          {/* Jira Routes */}
          <Route path="jira/departments" element={<Departments />} />
          <Route path="jira/departments/add" element={<DepartmentForm />} />
          <Route path="jira/departments/edit/:id" element={<DepartmentForm />} />
          
          <Route path="jira/roles" element={<Roles />} />
          <Route path="jira/roles/add" element={<RoleForm />} />
          <Route path="jira/roles/edit/:id" element={<RoleForm />} />
          
          <Route path="jira/task-submissions" element={<TaskSubmissions />} />
          <Route path="jira/task-submissions/add" element={<TaskSubmissionForm />} />
          <Route path="jira/task-submissions/edit/:id" element={<TaskSubmissionForm />} />
          
          <Route path="jira/tasks" element={<Tasks />} />
          <Route path="jira/tasks/add" element={<TaskForm />} />
          <Route path="jira/tasks/edit/:id" element={<TaskForm />} />
          
          <Route path="jira/teams" element={<Teams />} />
          <Route path="jira/teams/add" element={<TeamForm />} />
          <Route path="jira/teams/edit/:id" element={<TeamForm />} />
          
          <Route path="jira/users" element={<Users />} />
          <Route path="jira/users/add" element={<UserForm />} />
          <Route path="jira/users/edit/:id" element={<UserForm />} />

          {/* Legacy/Other Routes (Hidden from Sidebar but kept for reference if needed) */}
          <Route path="contacts" element={<ContactList />} />
          <Route path="contacts/add" element={<ContactForm />} />
          <Route path="contacts/edit/:id" element={<ContactForm />} />
          
          <Route path="settings" element={<div className="text-2xl font-bold text-gray-800">Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

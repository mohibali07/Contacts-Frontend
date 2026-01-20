import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LogOut, LayoutDashboard, Settings, 
  Briefcase, ChevronDown, ChevronRight,
  Users, Layers, CheckSquare, FileText, Shield
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 ${
        isActive
          ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`
    }
  >
    <div className="flex items-center gap-3.5">
      <Icon className="h-5 w-5" />
      <span className="font-medium text-sm">{label}</span>
    </div>
  </NavLink>
);

const NavGroup = ({ icon: Icon, label, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <Icon className="h-5 w-5" />
          <span className="font-medium text-sm">{label}</span>
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      
      {isOpen && (
        <div className="pl-4 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden md:flex flex-col p-6 overflow-y-auto">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-sm font-bold">iF</div>
            iFinance
          </h1>
        </div>

        <nav className="flex-1 space-y-6">
          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main</p>
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          </div>

          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Jira Module</p>
            
            <NavGroup icon={Briefcase} label="Project Management" defaultOpen={true}>
              <NavItem to="/jira/departments" icon={Layers} label="Departments" />
              <NavItem to="/jira/roles" icon={Shield} label="Roles" />
              <NavItem to="/jira/task-submissions" icon={FileText} label="Task Submissions" />
              <NavItem to="/jira/tasks" icon={CheckSquare} label="Tasks" />
              <NavItem to="/jira/teams" icon={Users} label="Teams" />
              <NavItem to="/jira/users" icon={Users} label="Users" />
            </NavGroup>
          </div>

          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">System</p>
            <NavItem to="/settings" icon={Settings} label="Settings" />
          </div>
        </nav>

        <div className="pt-6 border-t border-gray-100 mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-4 py-3.5 w-full text-left text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 md:hidden flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-bold text-gray-900">iFinance</h1>
          <button onClick={handleLogout} className="text-gray-500">
            <LogOut className="h-5 w-5" />
          </button>
        </header>
        <div className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

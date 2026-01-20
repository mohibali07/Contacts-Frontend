import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Briefcase, 
  CheckSquare, 
  FileText, 
  UserCheck, 
  Building2, 
  Search,
  Bell,
  HelpCircle,
  ChevronRight,
  Plus,
  BarChart2
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active, onClick, hasSubmenu }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-base font-medium mb-0.5
      ${active 
        ? 'bg-blue-50 text-blue-700' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
  >
    <Icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
    <span className="flex-1 text-left">{label}</span>
  </button>
);

const SidebarGroup = ({ title, children }) => (
  <div className="mb-6">
    {title && (
      <h3 className="px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center group cursor-pointer hover:text-slate-600">
        {title}
        <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </h3>
    )}
    <div className="space-y-0.5">
      {children}
    </div>
  </div>
);

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-white flex font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 border-r border-slate-200 transform transition-transform duration-200 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center px-4 border-b border-slate-200/50">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-slate-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">i</span>
            </div>
            <span className="font-bold text-slate-900 text-sm">i finance</span>
            <ChevronRight className="h-3 w-3 text-slate-400 ml-auto" />
          </div>
          <button 
            className="md:hidden ml-auto text-slate-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-3 overflow-y-auto h-[calc(100vh-3.5rem)]">
          
          <SidebarGroup>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={isActive('/dashboard')} onClick={() => navigate('/dashboard')} />
            <SidebarItem icon={Building2} label="Departments" path="/departments" active={isActive('/departments')} onClick={() => navigate('/departments')} />
            <SidebarItem icon={UserCheck} label="Roles" path="/roles" active={isActive('/roles')} onClick={() => navigate('/roles')} />
            <SidebarItem icon={Users} label="Users" path="/users" active={isActive('/users')} onClick={() => navigate('/users')} />
            <SidebarItem icon={Users} label="Teams" path="/teams" active={isActive('/teams')} onClick={() => navigate('/teams')} />
            <SidebarItem icon={CheckSquare} label="Tasks" path="/tasks" active={isActive('/tasks')} onClick={() => navigate('/tasks')} />
            <SidebarItem icon={FileText} label="Submissions" path="/task-submissions" active={isActive('/task-submissions')} onClick={() => navigate('/task-submissions')} />
          </SidebarGroup>

          <SidebarGroup title="Settings">
            <SidebarItem icon={Settings} label="Settings" path="/settings" active={isActive('/settings')} onClick={() => navigate('/settings')} />
            <SidebarItem icon={LogOut} label="Logout" path="/logout" onClick={handleLogout} />
          </SidebarGroup>

        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        
        {/* Top Header */}
        <header className="h-14 border-b border-slate-100 bg-white flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="md:hidden text-slate-500"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Breadcrumbs / Context */}
            {/* Breadcrumbs / Context */}
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-900">i finance</span>
              {location.pathname.split('/').filter(Boolean).map((segment, index, array) => {
                if (segment.toLowerCase() === 'jira') return null;

                const path = `/${array.slice(0, index + 1).join('/')}`;
                const isLast = index === array.length - 1;
                const formatSegment = (str) => {
                  return str
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase());
                };

                return (
                  <React.Fragment key={path}>
                    <span className="text-slate-300">/</span>
                    <span 
                      className={`${isLast ? 'text-slate-500' : 'hover:text-slate-900 cursor-pointer'}`}
                      onClick={() => !isLast && navigate(path)}
                    >
                      {formatSegment(segment)}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search i finance" 
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-md text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 w-64"
              />
            </div>

            <div className="h-4 w-px bg-slate-200 mx-2"></div>


            
            <div className="relative">
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:bg-blue-700 transition-colors select-none"
              >
                MA
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-sm font-bold text-slate-900">Mohib Ali</p>
                    <p className="text-xs text-slate-500">admin@ifinance.com</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-white">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default Layout;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Briefcase, 
  TrendingUp,
  MoreHorizontal,
  Plus,
  ArrowRight,
  Calendar,
  User
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem('jira_tasks') || '[]');
    
    setStats({
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      overdue: tasks.filter(t => t.status === 'Overdue').length
    });

    // Get 5 most recent tasks (assuming new ones are added to the end or we sort by id/date)
    // For now, just taking the last 5 and reversing them
    setRecentTasks([...tasks].reverse().slice(0, 5));
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>

    </div>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 sm:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Welcome back, Admin! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <button 
              onClick={() => navigate('/tasks/add')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-slate-200 transition-all flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Tasks" 
            value={stats.total} 
            icon={Briefcase} 
            color="bg-slate-900" 
            trend="+12%" 
          />
          <StatCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={Clock} 
            color="bg-blue-500" 
            trend="+5%" 
          />
          <StatCard 
            title="Completed" 
            value={stats.completed} 
            icon={CheckCircle2} 
            color="bg-green-500" 
            trend="+18%" 
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon={AlertCircle} 
            color="bg-orange-500" 
            trend="-2%" 
          />
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Tasks Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Recent Tasks</h2>
              <button 
                onClick={() => navigate('/tasks')}
                className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1 hover:underline"
              >
                View All <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Task</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned To</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentTasks.length > 0 ? (
                    recentTasks.map((task) => (
                      <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4">
                          <span 
                            className="font-bold text-slate-700 hover:text-blue-600 cursor-pointer transition-colors block truncate max-w-[200px]"
                            onClick={() => navigate(`/tasks/edit/${task.id}`)}
                          >
                            {task.title}
                          </span>
                          <span className="text-xs text-slate-400">ID: #{task.id}</span>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                              {task.assigned_to?.charAt(0) || 'U'}
                            </div>
                            <span className="text-sm font-medium text-slate-600 truncate max-w-[120px]">{task.assigned_to}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-sm font-medium text-slate-500">
                          {task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-12 text-center text-slate-400">
                        No recent tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Side Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
              <h2 className="text-lg font-bold text-slate-900 mb-4 relative z-10">Quick Actions</h2>
              <div className="space-y-3 relative z-10">
                <button 
                  onClick={() => navigate('/departments/add')}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-center gap-3 transition-all text-sm font-medium text-slate-700"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Add Department</span>
                  <ArrowRight className="h-4 w-4 ml-auto text-slate-400" />
                </button>
                <button 
                  onClick={() => navigate('/users/add')}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-center gap-3 transition-all text-sm font-medium text-slate-700"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>Add User</span>
                  <ArrowRight className="h-4 w-4 ml-auto text-slate-400" />
                </button>
              </div>
            </div>


          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

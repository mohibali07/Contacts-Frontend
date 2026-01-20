import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X, ChevronDown } from 'lucide-react';

const GenericList = ({ 
  title, 
  subtitle, 
  columns, 
  data, 
  onAdd, 
  onEdit, 
  onDelete,
  filterContent,
  onResetFilters,
  extraHeaderActions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Close filter popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleReset = () => {
    setSearchTerm('');
    if (onResetFilters) {
      onResetFilters();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 sm:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
              {subtitle && <p className="text-slate-500 mt-1 text-sm font-medium">{subtitle}</p>}
            </div>
            {extraHeaderActions}
          </div>
          <button
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-sm shadow-blue-200 transition-all flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create New</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm font-medium"
          />
          
          {/* Filter Button (Absolute positioned inside search or separate?) 
              Screenshot doesn't show filters, but we need them. 
              Let's keep them accessible but maybe subtle or next to search if needed.
              For now, hiding unless filterContent is present, maybe as an icon inside right of search?
          */}
          {filterContent && (
            <div className="absolute inset-y-0 right-2 flex items-center" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2 rounded-lg transition-colors ${isFilterOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              >
                <Filter className="h-5 w-5" />
              </button>

              {/* Filter Popup */}
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Filter By</h3>
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm text-slate-600">
                      {filterContent}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex justify-end gap-2">
                    <button 
                      onClick={handleReset}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => setIsFilterOpen(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Data Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  {columns.map((col, idx) => (
                    <th key={idx} className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {col.header}
                    </th>
                  ))}
                  <th className="px-8 py-6 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-8 py-5 text-sm font-medium text-slate-700">
                        {col.render ? col.render(item) : item[col.accessor]}
                      </td>
                    ))}
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit && onEdit(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => onDelete && onDelete(item)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No results found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                We couldn't find any records matching your search.
              </p>
            </div>
          )}

          {/* Footer / Pagination */}
          {filteredData.length > 0 && (
            <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">
                Showing <span className="text-slate-900 font-bold">{filteredData.length}</span> entries
              </span>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all disabled:opacity-50 shadow-sm">
                  Previous
                </button>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all disabled:opacity-50 shadow-sm">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericList;


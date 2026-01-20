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
  onResetFilters
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
    // We keep the filter open or close it? Usually reset keeps it open to show changes, 
    // but here we might want to just reset everything.
    // Let's keep it open so user sees it cleared.
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 sm:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-slate-500 mt-1 text-sm font-medium">{subtitle}</p>}
          </div>
          <button
            onClick={onAdd}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Create New</span>
          </button>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-transparent border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-100 focus:bg-slate-50 transition-all font-medium sm:text-sm"
            />
          </div>

          {/* Filter Button & Popup */}
          {filterContent && (
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all border ${
                  isFilterOpen
                    ? 'bg-slate-100 text-slate-900 border-slate-200'
                    : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Popup */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
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

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {columns.map((col, idx) => (
                    <th key={idx} className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {col.header}
                    </th>
                  ))}
                  <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-blue-50/30 transition-colors">
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                        {col.render ? col.render(item) : item[col.accessor]}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit && onEdit(item)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onDelete && onDelete(item)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No results found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                We couldn't find any records matching your search. Try adjusting your filters or search query.
              </p>
            </div>
          )}

          {/* Footer / Pagination */}
          {filteredData.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Showing <span className="text-slate-900 font-bold">{filteredData.length}</span> entries
              </span>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all disabled:opacity-50 shadow-sm">
                  Previous
                </button>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all disabled:opacity-50 shadow-sm">
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

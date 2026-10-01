import React, { useContext, useRef, useEffect } from 'react';
import { FilterContext } from '../context/FilterContext';

const FilterBar: React.FC = () => {
  const { filters, removeFilter, clearFilters } = useContext(FilterContext);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current && filters.length > 0) {
      barRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filters]);

  if (filters.length === 0) return null;

  return (
    <div ref={barRef} className="bg-white p-4 mb-6 shadow-md rounded-md flex items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <div key={filter} className="flex items-center bg-cyan-100 rounded overflow-hidden">
            <span className="px-2 text-cyan-700">{filter}</span>
            <button
              className="bg-cyan-700 text-white px-2"
              onClick={() => removeFilter(filter)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button className="text-cyan-700 font-bold" onClick={clearFilters}>
        Clear
      </button>
    </div>
  );
};

export default FilterBar;

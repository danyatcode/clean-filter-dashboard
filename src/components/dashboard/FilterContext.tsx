import React, { createContext, useState, useContext, useEffect } from 'react';
import { Filter, api } from '@/services/api';
import { toast } from "sonner";

interface FilterContextType {
  filters: Filter[];
  addFilter: (filter: Filter) => void;
  removeFilter: (field: string) => void;
  clearFilters: () => void;
  isLoading: boolean;
  filterOptions: Record<string, string[]>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setIsLoading(true);
        const options = await api.getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Failed to load filter options:', error);
        toast.error('Failed to load filter options');
      } finally {
        setIsLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  const addFilter = (filter: Filter) => {
    setFilters(prev => {
      // Replace if filter for this field already exists
      const exists = prev.some(f => f.field === filter.field);
      
      if (exists) {
        return prev.map(f => f.field === filter.field ? filter : f);
      }
      
      // Otherwise add new filter
      return [...prev, filter];
    });
    
    // Show toast notification
    toast.success(`Filter added: ${filter.field} ${filter.operator || 'eq'} ${filter.value}`);
  };

  const removeFilter = (field: string) => {
    setFilters(prev => prev.filter(f => f.field !== field));
    toast.info(`Filter removed: ${field}`);
  };

  const clearFilters = () => {
    setFilters([]);
    toast.info('All filters cleared');
  };

  return (
    <FilterContext.Provider 
      value={{ 
        filters, 
        addFilter, 
        removeFilter, 
        clearFilters,
        isLoading,
        filterOptions
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export default FilterContext;

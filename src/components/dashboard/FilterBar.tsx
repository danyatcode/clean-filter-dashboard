
import React, { useState } from 'react';
import { Filter } from '@/services/api';
import { useFilters } from './FilterContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Filter as FilterIcon, Plus, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const operators = [
  { value: 'eq', label: 'equals' },
  { value: 'neq', label: 'not equals' },
  { value: 'gt', label: 'greater than' },
  { value: 'lt', label: 'less than' },
  { value: 'contains', label: 'contains' }
];

const FilterBar: React.FC = () => {
  const { filters, addFilter, removeFilter, clearFilters, filterOptions, isLoading } = useFilters();
  const [field, setField] = useState<string>('');
  const [operator, setOperator] = useState<'eq' | 'neq' | 'gt' | 'lt' | 'contains'>('eq');
  const [value, setValue] = useState<string>('');
  const [isAddingFilter, setIsAddingFilter] = useState(false);
  
  const isNumericField = (field: string) => {
    return ['amount', 'units', 'budget', 'progress', 'totalSpent'].includes(field);
  };
  
  const handleAddFilter = () => {
    if (!field || !value) return;
    
    const filterValue = isNumericField(field) ? Number(value) : value;
    
    addFilter({
      field,
      operator,
      value: filterValue
    });
    
    // Reset form
    setField('');
    setOperator('eq');
    setValue('');
    setIsAddingFilter(false);
  };

  const fieldOptions = [
    { value: 'region', label: 'Region' },
    { value: 'category', label: 'Category' },
    { value: 'status', label: 'Status' },
    { value: 'team', label: 'Team' },
    { value: 'location', label: 'Location' },
    { value: 'amount', label: 'Amount' },
    { value: 'units', label: 'Units' },
    { value: 'progress', label: 'Progress' }
  ];

  return (
    <div className="bg-white border border-border/40 rounded-lg shadow-sm p-4 mb-6 transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FilterIcon className="w-4 h-4 text-muted-foreground mr-2" />
          <h3 className="text-base font-medium">Filters</h3>
          {filters.length > 0 && (
            <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              {filters.length}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {filters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-xs h-8 px-2"
            >
              Clear all
            </Button>
          )}
          
          <Popover open={isAddingFilter} onOpenChange={setIsAddingFilter}>
            <PopoverTrigger asChild>
              <Button size="sm" className="h-8">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Add Filter</h4>
                  <p className="text-xs text-muted-foreground">
                    Filter the dashboard data based on specific criteria.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="field" className="text-xs font-medium">
                        Field
                      </label>
                      <Select 
                        value={field} 
                        onValueChange={setField}
                      >
                        <SelectTrigger id="field">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="operator" className="text-xs font-medium">
                        Operator
                      </label>
                      <Select 
                        value={operator} 
                        onValueChange={(val) => setOperator(val as any)}
                      >
                        <SelectTrigger id="operator">
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {operators
                            .filter(op => 
                              !isNumericField(field) ? op.value !== 'gt' && op.value !== 'lt' : true
                            )
                            .map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="value" className="text-xs font-medium">
                      Value
                    </label>
                    {field && filterOptions[field] ? (
                      <Select value={value} onValueChange={setValue}>
                        <SelectTrigger id="value">
                          <SelectValue placeholder="Select value" />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOptions[field].map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="value"
                        type={isNumericField(field) ? "number" : "text"}
                        placeholder="Enter value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={handleAddFilter}
                    disabled={!field || !value}
                  >
                    Add Filter
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {filters.map((filter, index) => (
            <div 
              key={`${filter.field}-${index}`}
              className="bg-secondary rounded-full pl-3 pr-1 py-1 flex items-center text-xs animate-scale"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="font-medium mr-1">{filter.field}</span>
              <span className="text-muted-foreground mr-1">
                {operators.find(op => op.value === filter.operator)?.label || 'equals'}
              </span>
              <span>{String(filter.value)}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 ml-1 hover:bg-secondary-foreground/10 rounded-full"
                onClick={() => removeFilter(filter.field)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {filters.length === 0 && !isAddingFilter && (
        <div className="text-sm text-muted-foreground animate-fade-in">
          No filters applied. Add a filter to refine the dashboard data.
        </div>
      )}
    </div>
  );
};

export default FilterBar;

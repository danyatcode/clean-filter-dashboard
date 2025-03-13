
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2
} from "lucide-react";
import { SalesData, ApiParams } from '@/services/api';
import { useFilters } from './FilterContext';

interface DataTableProps {
  data: any[];
  columns: {
    id: string;
    header: string;
    cell: (row: any) => React.ReactNode;
    sortable?: boolean;
  }[];
  isLoading: boolean;
  totalItems: number;
  onParamsChange: (params: ApiParams) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  isLoading,
  totalItems,
  onParamsChange
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { filters } = useFilters();

  const handleSort = (columnId: string) => {
    if (sortBy === columnId) {
      // Toggle direction
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New column
      setSortBy(columnId);
      setSortDirection('asc');
    }
  };

  useEffect(() => {
    // Reset to first page when filters change
    setPage(1);
  }, [filters]);

  useEffect(() => {
    onParamsChange({
      filters,
      page,
      pageSize,
      sortBy,
      sortDirection
    });
  }, [filters, page, pageSize, sortBy, sortDirection, onParamsChange]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const renderSortIcon = (columnId: string) => {
    if (sortBy !== columnId) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="rounded-lg border overflow-hidden bg-white animate-fade-in">
      <div className="relative">
        <Table className="w-full">
          <TableHeader className="bg-secondary/50">
            <TableRow>
              {columns.map(column => (
                <TableHead 
                  key={column.id}
                  className={`whitespace-nowrap font-medium text-xs uppercase tracking-wide ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && renderSortIcon(column.id)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map(column => (
                    <TableCell key={`${column.id}-skeleton-${index}`}>
                      <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-4">
                    <p className="text-muted-foreground">No results found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow 
                  key={row.id || index}
                  className="transition-colors hover:bg-muted/20"
                >
                  {columns.map(column => (
                    <TableCell key={`${row.id}-${column.id}`}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading data...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="text-sm text-muted-foreground">
          {isLoading ? (
            <span className="flex items-center gap-1">
              <div className="h-3 w-16 bg-muted/50 rounded animate-pulse"></div>
            </span>
          ) : (
            <span>
              Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, totalItems)}</span> to <span className="font-medium">{Math.min(page * pageSize, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPage(1)}
            disabled={page === 1 || isLoading}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          
          <div className="flex items-center gap-1 mx-2">
            <span className="text-sm font-medium">{page}</span>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm text-muted-foreground">{totalPages}</span>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages || isLoading}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;

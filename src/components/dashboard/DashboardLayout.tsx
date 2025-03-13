
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  api, 
  ApiParams, 
  SalesData, 
  StatSummary, 
  ChartData 
} from '@/services/api';
import { useFilters, FilterProvider } from './FilterContext';
import FilterBar from './FilterBar';
import StatCard from './StatCard';
import DataTable from './DataTable';
import DataChart from './DataChart';
import DashboardSkeleton from './DashboardSkeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const formattedDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const salesColumns = [
  {
    id: 'date',
    header: 'Date',
    cell: (row: SalesData) => formattedDate(row.date),
    sortable: true
  },
  {
    id: 'product',
    header: 'Product',
    cell: (row: SalesData) => row.product,
    sortable: true
  },
  {
    id: 'category',
    header: 'Category',
    cell: (row: SalesData) => (
      <Badge variant="outline" className="font-normal">
        {row.category}
      </Badge>
    ),
    sortable: true
  },
  {
    id: 'region',
    header: 'Region',
    cell: (row: SalesData) => row.region,
    sortable: true
  },
  {
    id: 'amount',
    header: 'Amount',
    cell: (row: SalesData) => (
      <span className="font-medium">{formatCurrency(row.amount)}</span>
    ),
    sortable: true
  },
  {
    id: 'units',
    header: 'Units',
    cell: (row: SalesData) => row.units,
    sortable: true
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row: SalesData) => {
      const variants: Record<string, string> = {
        completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        pending: 'bg-amber-100 text-amber-700 border-amber-200',
        cancelled: 'bg-rose-100 text-rose-700 border-rose-200'
      };
      
      return (
        <Badge 
          className={`font-medium ${variants[row.status]}`}
          variant="outline"
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      );
    },
    sortable: true
  }
];

const InnerDashboard: React.FC = () => {
  const { filters } = useFilters();
  const [salesParams, setSalesParams] = useState<ApiParams>({
    page: 1,
    pageSize: 10,
    filters: []
  });
  
  // Stats query
  const { 
    data: statsData, 
    isLoading: isStatsLoading 
  } = useQuery({
    queryKey: ['stats', filters],
    queryFn: () => api.getStatSummary(filters),
  });
  
  // Sales data query
  const { 
    data: salesData, 
    isLoading: isSalesLoading 
  } = useQuery({
    queryKey: ['sales', salesParams],
    queryFn: () => api.getSalesData(salesParams),
  });
  
  // Sales chart query
  const { 
    data: salesChartData, 
    isLoading: isSalesChartLoading 
  } = useQuery({
    queryKey: ['salesChart', filters],
    queryFn: () => api.getSalesChart(filters),
  });
  
  // Category chart query
  const { 
    data: categoryChartData, 
    isLoading: isCategoryChartLoading 
  } = useQuery({
    queryKey: ['categoryChart', filters],
    queryFn: () => api.getCategoryDistribution(filters),
  });

  // Handle sales table param changes
  const handleSalesParamsChange = (params: ApiParams) => {
    setSalesParams(prev => ({
      ...prev,
      ...params,
      filters
    }));
  };

  useEffect(() => {
    // Update sales params when filters change
    setSalesParams(prev => ({
      ...prev,
      filters,
      page: 1 // Reset to first page on filter change
    }));
  }, [filters]);

  const isInitialLoading = isStatsLoading && isSalesLoading && isSalesChartLoading && isCategoryChartLoading;

  if (isInitialLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <FilterBar />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={statsData?.totalRevenue || 0}
          type="money"
          change={2.5}
          isLoading={isStatsLoading}
          delay={100}
        />
        <StatCard
          title="Total Sales"
          value={statsData?.totalSales || 0}
          type="count"
          change={-1.2}
          isLoading={isStatsLoading}
          delay={200}
        />
        <StatCard
          title="Conversion Rate"
          value={statsData?.conversionRate || 0}
          type="conversion"
          change={3.7}
          isLoading={isStatsLoading}
          delay={300}
        />
        <StatCard
          title="Average Order"
          value={statsData?.averageOrderValue || 0}
          type="money"
          change={1.3}
          isLoading={isStatsLoading}
          delay={400}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DataChart
          title="Revenue Trend"
          data={salesChartData || { labels: [], datasets: [] }}
          type="area"
          isLoading={isSalesChartLoading}
          delay={500}
        />
        <DataChart
          title="Revenue by Category"
          data={categoryChartData || { labels: [], datasets: [] }}
          type="pie"
          isLoading={isCategoryChartLoading}
          delay={600}
        />
      </div>
      
      <h2 className="text-xl font-medium mt-8 mb-4">Sales Transactions</h2>
      
      <DataTable
        data={salesData?.data || []}
        columns={salesColumns}
        isLoading={isSalesLoading}
        totalItems={salesData?.total || 0}
        onParamsChange={handleSalesParamsChange}
      />
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  return (
    <FilterProvider>
      <InnerDashboard />
    </FilterProvider>
  );
};

export default DashboardLayout;

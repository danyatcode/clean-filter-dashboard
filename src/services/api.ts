
// Simulated API service - would be replaced with actual API calls in a real app

// Types
export interface Filter {
  field: string;
  value: string | number | boolean | null;
  operator?: 'eq' | 'neq' | 'gt' | 'lt' | 'contains';
}

export interface ApiParams {
  filters?: Filter[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface SalesData {
  id: number;
  date: string;
  product: string;
  category: string;
  region: string;
  amount: number;
  units: number;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface ProjectData {
  id: number;
  name: string;
  team: string;
  status: 'active' | 'completed' | 'on hold';
  progress: number;
  deadline: string;
  budget: number;
}

export interface CustomerData {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  lastPurchase: string;
  totalSpent: number;
  location: string;
}

export interface StatSummary {
  totalRevenue: number;
  totalSales: number;
  activeCustomers: number;
  conversionRate: number;
  averageOrderValue: number;
  monthlyGrowth: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

// Mock data generator
const generateMockSalesData = (): SalesData[] => {
  const products = ['Laptop', 'Smartphone', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Headphones', 'Speakers'];
  const categories = ['Electronics', 'Accessories', 'Peripherals', 'Audio'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
  const statuses = ['completed', 'pending', 'cancelled'] as const;
  
  return Array.from({ length: 200 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    return {
      id: i + 1,
      date: date.toISOString().split('T')[0],
      product: products[Math.floor(Math.random() * products.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      amount: Math.round(Math.random() * 1000 + 50),
      units: Math.floor(Math.random() * 10 + 1),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    };
  });
};

const generateMockProjectData = (): ProjectData[] => {
  const teams = ['Engineering', 'Design', 'Marketing', 'Sales', 'Support'];
  const statuses = ['active', 'completed', 'on hold'] as const;
  
  return Array.from({ length: 50 }, (_, i) => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + Math.floor(Math.random() * 60));
    
    return {
      id: i + 1,
      name: `Project ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 100)}`,
      team: teams[Math.floor(Math.random() * teams.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      progress: Math.floor(Math.random() * 100),
      deadline: deadline.toISOString().split('T')[0],
      budget: Math.round(Math.random() * 50000 + 5000)
    };
  });
};

const generateMockCustomerData = (): CustomerData[] => {
  const firstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'London', 'Berlin', 'Tokyo', 'Sydney'];
  const statuses = ['active', 'inactive'] as const;
  
  return Array.from({ length: 100 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const lastPurchaseDate = new Date();
    lastPurchaseDate.setDate(lastPurchaseDate.getDate() - Math.floor(Math.random() * 30));
    
    return {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastPurchase: lastPurchaseDate.toISOString().split('T')[0],
      totalSpent: Math.round(Math.random() * 5000 + 100),
      location: locations[Math.floor(Math.random() * locations.length)]
    };
  });
};

// Mock data cache
const MOCK_DATA = {
  sales: generateMockSalesData(),
  projects: generateMockProjectData(),
  customers: generateMockCustomerData()
};

// Helper function to apply filters
const applyFilters = <T>(data: T[], filters?: Filter[]): T[] => {
  if (!filters || filters.length === 0) return data;
  
  return data.filter(item => {
    return filters.every(filter => {
      const itemValue = (item as any)[filter.field];
      
      if (itemValue === undefined) return false;
      
      switch (filter.operator) {
        case 'neq':
          return itemValue !== filter.value;
        case 'gt':
          return itemValue > filter.value;
        case 'lt':
          return itemValue < filter.value;
        case 'contains':
          return String(itemValue).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'eq':
        default:
          return itemValue === filter.value;
      }
    });
  });
};

// Helper function to apply sorting
const applySorting = <T>(data: T[], sortBy?: string, sortDirection: 'asc' | 'desc' = 'asc'): T[] => {
  if (!sortBy) return data;
  
  return [...data].sort((a, b) => {
    const aValue = (a as any)[sortBy];
    const bValue = (b as any)[sortBy];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' 
      ? (aValue > bValue ? 1 : -1) 
      : (aValue < bValue ? 1 : -1);
  });
};

// Helper function to apply pagination
const applyPagination = <T>(data: T[], page: number = 1, pageSize: number = 10): T[] => {
  const start = (page - 1) * pageSize;
  return data.slice(start, start + pageSize);
};

// API methods
export const api = {
  async getSalesData(params: ApiParams = {}): Promise<{ data: SalesData[], total: number }> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const { filters, page = 1, pageSize = 10, sortBy, sortDirection } = params;
    
    let filteredData = applyFilters(MOCK_DATA.sales, filters);
    
    if (sortBy) {
      filteredData = applySorting(filteredData, sortBy, sortDirection);
    }
    
    const paginatedData = applyPagination(filteredData, page, pageSize);
    
    return {
      data: paginatedData,
      total: filteredData.length
    };
  },
  
  async getProjectData(params: ApiParams = {}): Promise<{ data: ProjectData[], total: number }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const { filters, page = 1, pageSize = 10, sortBy, sortDirection } = params;
    
    let filteredData = applyFilters(MOCK_DATA.projects, filters);
    
    if (sortBy) {
      filteredData = applySorting(filteredData, sortBy, sortDirection);
    }
    
    const paginatedData = applyPagination(filteredData, page, pageSize);
    
    return {
      data: paginatedData,
      total: filteredData.length
    };
  },
  
  async getCustomerData(params: ApiParams = {}): Promise<{ data: CustomerData[], total: number }> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const { filters, page = 1, pageSize = 10, sortBy, sortDirection } = params;
    
    let filteredData = applyFilters(MOCK_DATA.customers, filters);
    
    if (sortBy) {
      filteredData = applySorting(filteredData, sortBy, sortDirection);
    }
    
    const paginatedData = applyPagination(filteredData, page, pageSize);
    
    return {
      data: paginatedData,
      total: filteredData.length
    };
  },
  
  async getStatSummary(filters?: Filter[]): Promise<StatSummary> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filteredSales = applyFilters(MOCK_DATA.sales, filters);
    const filteredCustomers = applyFilters(MOCK_DATA.customers, filters);
    
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalSales = filteredSales.length;
    const completedSales = filteredSales.filter(sale => sale.status === 'completed').length;
    const activeCustomers = filteredCustomers.filter(customer => customer.status === 'active').length;
    
    return {
      totalRevenue,
      totalSales,
      activeCustomers,
      conversionRate: totalSales > 0 ? (completedSales / totalSales) * 100 : 0,
      averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0,
      monthlyGrowth: 5.7 // Mock fixed value
    };
  },
  
  async getSalesChart(filters?: Filter[]): Promise<ChartData> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const filteredSales = applyFilters(MOCK_DATA.sales, filters);
    
    // Group by date and calculate total by date
    const salesByDate = filteredSales.reduce<Record<string, number>>((acc, sale) => {
      const date = sale.date;
      acc[date] = (acc[date] || 0) + sale.amount;
      return acc;
    }, {});
    
    // Sort dates and get the most recent 7
    const sortedDates = Object.keys(salesByDate).sort().slice(-7);
    
    return {
      labels: sortedDates,
      datasets: [{
        label: 'Revenue',
        data: sortedDates.map(date => salesByDate[date]),
        color: '#3b82f6'
      }]
    };
  },
  
  async getCategoryDistribution(filters?: Filter[]): Promise<ChartData> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const filteredSales = applyFilters(MOCK_DATA.sales, filters);
    
    // Group by category
    const salesByCategory = filteredSales.reduce<Record<string, number>>((acc, sale) => {
      const category = sale.category;
      acc[category] = (acc[category] || 0) + sale.amount;
      return acc;
    }, {});
    
    // Convert to chart data format
    const categories = Object.keys(salesByCategory);
    
    return {
      labels: categories,
      datasets: [{
        label: 'Revenue by Category',
        data: categories.map(category => salesByCategory[category]),
        color: '#10b981'
      }]
    };
  },
  
  async getFilterOptions(): Promise<Record<string, string[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Extract unique values for each filterable field
    const regions = [...new Set(MOCK_DATA.sales.map(sale => sale.region))];
    const categories = [...new Set(MOCK_DATA.sales.map(sale => sale.category))];
    const statuses = [...new Set(MOCK_DATA.sales.map(sale => sale.status))];
    const teams = [...new Set(MOCK_DATA.projects.map(project => project.team))];
    const locations = [...new Set(MOCK_DATA.customers.map(customer => customer.location))];
    
    return {
      regions,
      categories,
      statuses,
      teams,
      locations
    };
  }
};

export default api;

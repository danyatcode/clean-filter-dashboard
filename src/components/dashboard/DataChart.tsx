
import React, { useEffect, useRef } from 'react';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell,
  Legend, 
  Line, 
  LineChart, 
  Pie,
  PieChart,
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartData } from '@/services/api';

interface DataChartProps {
  title: string;
  data: ChartData;
  type: 'line' | 'bar' | 'area' | 'pie';
  height?: number;
  isLoading?: boolean;
  delay?: number;
}

const COLORS = [
  '#3b82f6', 
  '#10b981', 
  '#f59e0b', 
  '#ef4444', 
  '#8b5cf6', 
  '#06b6d4', 
  '#f43f5e',
  '#6366f1'
];

const DataChart: React.FC<DataChartProps> = ({ 
  title, 
  data, 
  type, 
  height = 300,
  isLoading = false,
  delay = 0
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isLoading && chartRef.current) {
      // Force a redraw to avoid animation issues with responsive container
      window.dispatchEvent(new Event('resize'));
    }
  }, [isLoading, data]);

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="space-y-4 w-full">
            <div className="h-4 bg-muted/50 rounded w-3/4 mx-auto animate-pulse"></div>
            <div className="h-40 bg-muted/30 rounded animate-pulse"></div>
          </div>
        </div>
      );
    }

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data.labels.map((label, i) => ({ 
              name: label, 
              ...data.datasets.reduce((acc, dataset, index) => {
                acc[dataset.label] = dataset.data[i];
                return acc;
              }, {} as Record<string, number>)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `$${(value / 1000).toFixed(0)}k`;
                  }
                  return `$${value}`;
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 8, 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px'
                }} 
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
              {data.datasets.map((dataset, index) => (
                <Line 
                  key={dataset.label}
                  type="monotone" 
                  dataKey={dataset.label} 
                  stroke={dataset.color || COLORS[index % COLORS.length]} 
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 0, fill: dataset.color || COLORS[index % COLORS.length] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data.labels.map((label, i) => ({ 
              name: label, 
              ...data.datasets.reduce((acc, dataset, index) => {
                acc[dataset.label] = dataset.data[i];
                return acc;
              }, {} as Record<string, number>)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `$${(value / 1000).toFixed(0)}k`;
                  }
                  return `$${value}`;
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 8, 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px'
                }} 
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
              {data.datasets.map((dataset, index) => (
                <Bar 
                  key={dataset.label} 
                  dataKey={dataset.label} 
                  fill={dataset.color || COLORS[index % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data.labels.map((label, i) => ({ 
              name: label, 
              ...data.datasets.reduce((acc, dataset, index) => {
                acc[dataset.label] = dataset.data[i];
                return acc;
              }, {} as Record<string, number>)
            }))}>
              <defs>
                {data.datasets.map((dataset, index) => (
                  <linearGradient 
                    key={`gradient-${dataset.label}`} 
                    id={`color-${dataset.label}`} 
                    x1="0" y1="0" x2="0" y2="1"
                  >
                    <stop 
                      offset="5%" 
                      stopColor={dataset.color || COLORS[index % COLORS.length]} 
                      stopOpacity={0.8}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={dataset.color || COLORS[index % COLORS.length]} 
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `$${(value / 1000).toFixed(0)}k`;
                  }
                  return `$${value}`;
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 8, 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px'
                }} 
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
              {data.datasets.map((dataset, index) => (
                <Area 
                  key={dataset.label}
                  type="monotone" 
                  dataKey={dataset.label} 
                  stroke={dataset.color || COLORS[index % COLORS.length]} 
                  fillOpacity={1}
                  fill={`url(#color-${dataset.label})`}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        const pieData = data.labels.map((label, index) => ({
          name: label,
          value: data.datasets[0].data[index]
        }));
        
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 8, 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px'
                }} 
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', marginTop: '15px' }} />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-500 animate-slide-up h-full`}
      style={{ animationDelay: `${delay}ms` }}
      ref={chartRef}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default DataChart;

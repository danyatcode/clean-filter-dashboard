
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowDownRight, 
  ArrowUpRight,
  DollarSign,
  Users,
  BarChart3,
  ShoppingCart,
  ArrowRightLeft,
  TrendingUp
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  type: 'money' | 'users' | 'percent' | 'count' | 'conversion' | 'growth';
  isLoading?: boolean;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  type,
  isLoading = false,
  delay = 0
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;
    
    switch (type) {
      case 'money':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }).format(val);
      case 'percent':
      case 'conversion':
        return `${val.toFixed(1)}%`;
      case 'users':
      case 'count':
        return new Intl.NumberFormat('en-US').format(val);
      case 'growth':
        return `${val.toFixed(1)}%`;
      default:
        return String(val);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'money':
        return <DollarSign className="h-4 w-4 text-emerald-500" />;
      case 'users':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'percent':
        return <BarChart3 className="h-4 w-4 text-violet-500" />;
      case 'count':
        return <ShoppingCart className="h-4 w-4 text-amber-500" />;
      case 'conversion':
        return <ArrowRightLeft className="h-4 w-4 text-cyan-500" />;
      case 'growth':
        return <TrendingUp className="h-4 w-4 text-rose-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-500 animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
            <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {getIcon()}
              </div>
            </div>
            
            <div className="text-2xl font-bold mb-1">{formatValue(value)}</div>
            
            {typeof change !== 'undefined' && (
              <div className="flex items-center text-xs">
                {change >= 0 ? (
                  <span className="flex items-center text-emerald-500 font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {Math.abs(change).toFixed(1)}%
                  </span>
                ) : (
                  <span className="flex items-center text-rose-500 font-medium">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    {Math.abs(change).toFixed(1)}%
                  </span>
                )}
                <span className="ml-1 text-muted-foreground">vs last period</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;

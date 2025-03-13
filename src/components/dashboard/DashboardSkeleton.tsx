
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filter skeleton */}
      <div className="h-16 bg-white rounded-lg border border-border/40 shadow-sm p-4 animate-pulse" />
      
      {/* Stats row skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={`stat-skeleton-${index}`} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={`chart-skeleton-${index}`} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
                <div className="h-48 bg-muted/30 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Table skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="h-10 bg-secondary/50 rounded animate-pulse"></div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div 
                key={`row-skeleton-${index}`} 
                className="h-12 bg-muted/20 rounded animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSkeleton;

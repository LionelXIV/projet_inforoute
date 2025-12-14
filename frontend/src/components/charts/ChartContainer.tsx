import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const ChartContainer = ({ title, description, children, className }: ChartContainerProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px] min-h-[400px]" style={{ minWidth: 0 }}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};


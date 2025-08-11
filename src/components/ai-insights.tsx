import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Sparkles } from 'lucide-react';

interface AiInsightsProps {
  insights: string | null;
  isLoading: boolean;
}

export function AiInsights({ insights, isLoading }: AiInsightsProps) {
  return (
    <Card className="min-h-[200px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-body">AI Insights</CardTitle>
        <Lightbulb className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {!isLoading && insights && (
          <div className="text-sm font-body text-foreground/90 pt-2">
             <p>{insights}</p>
          </div>
        )}
        {!isLoading && !insights && (
          <div className="flex flex-col items-center justify-center h-[140px] text-center">
            <Sparkles className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground font-body">
              Submit an event to generate profitability and discoverability tips.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useAppSelector } from '@/store/hooks';

const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1', '#20c997', '#fd7e14', '#0dcaf0', '#6610f2', '#e83e8c'];

export const FormatDistributionChart = () => {
  const { stats } = useAppSelector((state) => state.stats);

  if (!stats?.formats) {
    return (
      <ChartContainer title="Répartition par format de fichier" description="Distribution des ressources par format">
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Aucune donnée disponible
        </div>
      </ChartContainer>
    );
  }

  // Trier les données par valeur décroissante et prendre les top 10
  const data = Object.entries(stats.formats)
    .map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      value,
      fullName: name
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <ChartContainer title="Répartition par format de fichier" description="Distribution des ressources par format">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => {
              const { name, percent } = props;
              if (!percent || percent < 0.05) return ''; // Ne pas afficher les labels trop petits
              return `${name}: ${(percent * 100).toFixed(0)}%`;
            }}
            outerRadius={100}
            fill="#0d6efd"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string, props: any) => {
              const total = data.reduce((sum, d) => sum + d.value, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
              return [
                `${value} (${percentage}%)`,
                props.payload?.fullName || name
              ];
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={80}
            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            formatter={(value, entry: any) => entry.payload.fullName || value}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

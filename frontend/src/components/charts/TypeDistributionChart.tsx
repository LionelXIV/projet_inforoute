import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useAppSelector } from '@/store/hooks';

export const TypeDistributionChart = () => {
  const { stats } = useAppSelector((state) => state.stats);

  if (!stats?.types) {
    return (
      <ChartContainer title="Répartition par type de ressource" description="Distribution des ressources par type">
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Aucune donnée disponible
        </div>
      </ChartContainer>
    );
  }

  const data = Object.entries(stats.types)
    .map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      nombre: value,
      fullName: name
    }))
    .sort((a, b) => b.nombre - a.nombre);

  return (
    <ChartContainer title="Répartition par type de ressource" description="Distribution des ressources par type">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => [
              value,
              props.payload.fullName || name
            ]}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar dataKey="nombre" fill="#198754" name="Nombre de ressources" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

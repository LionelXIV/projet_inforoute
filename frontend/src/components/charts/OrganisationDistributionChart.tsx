import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';

export const OrganisationDistributionChart = () => {
  const { stats } = useAppSelector((state) => state.stats);
  const { jeuxDonnees } = useAppSelector((state) => state.data);

  const data = useMemo(() => {
    // Priorité 1 : Utiliser les données calculées côté backend (cohérentes avec toutes les données)
    if (stats?.distribution_organisations && Object.keys(stats.distribution_organisations).length > 0) {
      return Object.entries(stats.distribution_organisations)
        .map(([name, count]) => ({
          name: name.length > 15 ? name.substring(0, 15) + '...' : name,
          nombre: count,
          fullName: name
        }))
        .sort((a, b) => b.nombre - a.nombre);
    }
    
    // Priorité 2 : Fallback sur les données chargées (peut être incomplet si > 1000 jeux)
    if (jeuxDonnees && jeuxDonnees.length > 0) {
      const grouped: Record<string, number> = {};
      
      jeuxDonnees.forEach((jeu) => {
        const orgName = jeu.organisation_nom || 'Inconnu';
        grouped[orgName] = (grouped[orgName] || 0) + 1;
      });

      return Object.entries(grouped)
        .map(([name, count]) => ({
          name: name.length > 15 ? name.substring(0, 15) + '...' : name,
          nombre: count,
          fullName: name
        }))
        .sort((a, b) => b.nombre - a.nombre)
        .slice(0, 10);
    }
    
    return [];
  }, [stats, jeuxDonnees]);

  if (data.length === 0) {
    return (
      <ChartContainer title="Top 10 des organisations" description="Organisations avec le plus de jeux de données">
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Aucune donnée disponible
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title="Top 10 des organisations" description="Organisations avec le plus de jeux de données">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => [
              value,
              props.payload.fullName || name
            ]}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="nombre" fill="#198754" name="Nombre de jeux" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

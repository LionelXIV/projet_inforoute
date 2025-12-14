import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';

export const TemporalEvolutionChart = () => {
  const { stats } = useAppSelector((state) => state.stats);
  const { jeuxDonnees } = useAppSelector((state) => state.data);

  const data = useMemo(() => {
    // Priorité 1 : Utiliser les données calculées côté backend (cohérentes avec toutes les données)
    if (stats?.evolution_temporelle && Object.keys(stats.evolution_temporelle).length > 0) {
      return Object.entries(stats.evolution_temporelle)
        .map(([date, count]) => ({
          date,
          nombre: count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }
    
    // Priorité 2 : Fallback sur les données chargées (peut être incomplet si > 1000 jeux)
    if (jeuxDonnees && jeuxDonnees.length > 0) {
      const grouped: Record<string, number> = {};
      
      jeuxDonnees.forEach((jeu) => {
        if (jeu.date_creation) {
          const date = new Date(jeu.date_creation);
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          grouped[monthYear] = (grouped[monthYear] || 0) + 1;
        }
      });

      return Object.entries(grouped)
        .map(([date, count]) => ({
          date,
          nombre: count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-12); // Derniers 12 mois
    }
    
    return [];
  }, [stats, jeuxDonnees]);

  if (data.length === 0) {
    return (
      <ChartContainer title="Évolution temporelle" description="Nombre de jeux de données créés par période">
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Aucune donnée disponible
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title="Évolution temporelle" description="Nombre de jeux de données créés par période">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="nombre" stroke="#0d6efd" name="Jeux de données" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};


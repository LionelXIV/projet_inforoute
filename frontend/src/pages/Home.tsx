import React from 'react';
import { Link } from 'react-router-dom';
import { Database, BarChart3, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              Bienvenue sur DataQC
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Plateforme de visualisation et d'exploration des données ouvertes du Québec
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader>
                <Database className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Jeux de données</CardTitle>
                <CardDescription>
                  Explorez et recherchez parmi des centaines de jeux de données ouverts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to="/jeux-donnees"
                  className="text-primary hover:underline font-medium"
                >
                  Explorer →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Statistiques</CardTitle>
                <CardDescription>
                  Visualisez les données avec des graphiques interactifs et des analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to="/statistics"
                  className="text-primary hover:underline font-medium"
                >
                  Voir les stats →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Recherche avancée</CardTitle>
                <CardDescription>
                  Utilisez des filtres dynamiques pour trouver exactement ce que vous cherchez
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to="/jeux-donnees"
                  className="text-primary hover:underline font-medium"
                >
                  Rechercher →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

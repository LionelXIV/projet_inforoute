import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExporter';

interface ExportButtonProps {
  elementId: string;
  filename?: string;
  title?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ExportButton = ({
  elementId,
  filename = 'export',
  title,
  variant = 'outline',
  size = 'default',
}: ExportButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await exportToPDF(elementId, filename, title);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={loading} variant={variant} size={size}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Génération...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Exporter en PDF
        </>
      )}
    </Button>
  );
};


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exporte un élément HTML en PDF
 * @param elementId - ID de l'élément à exporter
 * @param filename - Nom du fichier PDF (sans extension)
 * @param title - Titre à afficher dans le PDF (optionnel)
 */
export const exportToPDF = async (
  elementId: string,
  filename: string = 'export',
  title?: string
): Promise<void> => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Élément avec l'ID "${elementId}" introuvable`);
  }

  try {
    // Afficher un loader (optionnel)
    const loadingElement = document.createElement('div');
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '50%';
    loadingElement.style.left = '50%';
    loadingElement.style.transform = 'translate(-50%, -50%)';
    loadingElement.style.zIndex = '9999';
    loadingElement.style.padding = '20px';
    loadingElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    loadingElement.style.color = 'white';
    loadingElement.style.borderRadius = '8px';
    loadingElement.textContent = 'Génération du PDF...';
    document.body.appendChild(loadingElement);

    // Capturer l'élément avec html2canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Créer le PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Ajouter un en-tête si un titre est fourni
    if (title) {
      pdf.setFontSize(18);
      pdf.text(title, 105, 15, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(`Date d'exportation: ${new Date().toLocaleDateString('fr-CA')}`, 105, 22, {
        align: 'center',
      });
      position = 30; // Commencer après l'en-tête
    }

    // Ajouter l'image
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - position;

    // Ajouter des pages supplémentaires si nécessaire
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Sauvegarder le PDF
    pdf.save(`${filename}.pdf`);

    // Retirer le loader
    document.body.removeChild(loadingElement);
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
    throw new Error('Erreur lors de la génération du PDF');
  }
};


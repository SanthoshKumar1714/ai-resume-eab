import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useResume } from '../contexts/ResumeContext';
import { useApp } from '../contexts/AppContext';
import './ExportButton.css';

export default function ExportButton() {
  const { resume } = useResume();
  const { showNotification } = useApp();
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!resume || !resume.personalInfo?.fullName) {
      showNotification('Please add your name before exporting', 'error');
      return;
    }

    setExporting(true);

    try {
      const previewElement = document.getElementById('resume-preview');
      if (!previewElement) {
        throw new Error('Preview element not found');
      }

      // Capture the resume as canvas
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Convert to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Generate filename
      const fileName = `Resume_${resume.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`;

      // Download
      pdf.save(fileName);

      showNotification('PDF exported successfully!', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Failed to export PDF. Please try again.', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      className="button button-gradient export-button"
      onClick={handleExportPDF}
      disabled={exporting}
    >
      {exporting ? (
        <>
          <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
          Exporting...
        </>
      ) : (
        <>
          📄 Export PDF
        </>
      )}
    </button>
  );
}

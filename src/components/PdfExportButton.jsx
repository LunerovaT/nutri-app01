// components/PdfExportButton.jsx – tlačítko pro stažení / náhled PDF
// Používá @react-pdf/renderer – generuje PDF přímo v prohlížeči, bez serveru.

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { NutriPdfDocument } from '../pdf/NutriPdfDocument';

/**
 * @param {object} plan        – výstup z generateMealPlan()
 * @param {object} clientData  – surová data z formuláře
 * @param {string} [label]     – text tlačítka (volitelné)
 */
export default function PdfExportButton({
  plan,
  clientData,
  label = 'Stáhnout PDF',
}) {
  const [loading, setLoading] = useState(false);

  // clientData není k dispozici pokud byl klient otevřen ze seznamu
  // (uložen byl jen mealPlan, ne původní formData)
  const isDisabled = loading || !clientData;

  const handleDownload = async () => {
    console.log('plan:', plan);
    console.log('clientData:', clientData);
    setLoading(true);
    try {
      const blob = await pdf(
        <NutriPdfDocument plan={plan} clientData={clientData} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `jidelnicek-${plan.clientName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Chyba při generování PDF:', err);
      alert('Nepodařilo se vygenerovat PDF. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDisabled}
      title={
        !clientData
          ? 'PDF není dostupné pro klienty otevřené ze seznamu'
          : undefined
      }
      style={styles.btn(isDisabled)}
    >
      {loading ? '⏳ Generuji PDF…' : `📄 ${label}`}
    </button>
  );
}

// ─── INLINE STYLY (shodné s aplikací) ────────────────────────────────────────
const styles = {
  btn: (loading) => ({
    padding: '10px 20px',
    background: loading ? '#888' : '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  }),
};

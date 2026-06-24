// ============================================================
// LoadingSpinner.jsx - Komponen loading state
// Overlay loading penuh layar dengan spinner hijau
// ============================================================
import React, { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * Komponen LoadingSpinner
 * @param {string} text - Teks loading opsional
 * @param {boolean} fullPage - Tampilkan sebagai overlay penuh layar
 * @param {string} size - Ukuran spinner: sm, md, lg
 */
const LoadingSpinner = memo(function LoadingSpinner({
  text,
  fullPage = true,
  size = 'md',
}) {
  // Konfigurasi ukuran spinner
  const sizeConfig = {
    sm: { spinner: 24, border: 3 },
    md: { spinner: 40, border: 4 },
    lg: { spinner: 56, border: 5 },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Style overlay penuh layar
  const overlayStyle = fullPage
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(4px)',
        gap: '16px',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        gap: '16px',
      };

  // Style spinner
  const spinnerStyle = {
    width: config.spinner,
    height: config.spinner,
    borderRadius: '50%',
    border: `${config.border}px solid #E5E7EB`,
    borderTopColor: '#4CAF50',
    borderRightColor: '#4CAF50',
  };

  return (
    <div className="loading-spinner" style={overlayStyle}>
      {/* Spinner berputar */}
      <motion.div
        style={spinnerStyle}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: 'linear',
        }}
      />

      {/* Teks loading (opsional) */}
      {text && (
        <motion.p
          style={{
            margin: 0,
            fontSize: '14px',
            color: '#6B7280',
            fontWeight: '500',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
});

export default LoadingSpinner;

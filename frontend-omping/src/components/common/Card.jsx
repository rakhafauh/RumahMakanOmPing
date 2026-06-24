// ============================================================
// Card.jsx - Komponen kartu fleksibel
// Digunakan untuk menampilkan konten dalam container berdesain bersih
// ============================================================
import React, { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * Komponen Card reusable
 * @param {string} title - Judul kartu
 * @param {string} subtitle - Subjudul kartu
 * @param {React.Component} icon - Komponen ikon (lucide-react)
 * @param {React.ReactNode} children - Konten kartu
 * @param {string} className - Kelas CSS tambahan
 * @param {function} onClick - Handler klik
 * @param {boolean} hoverable - Efek hover terangkat
 * @param {object} style - Style tambahan
 */
const Card = memo(function Card({
  title,
  subtitle,
  icon: Icon,
  children,
  className = '',
  onClick,
  hoverable = false,
  style: customStyle = {},
}) {
  // Style dasar kartu
  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
    padding: '20px',
    cursor: onClick ? 'pointer' : 'default',
    border: '1px solid #F0F0F0',
    overflow: 'hidden',
    ...customStyle,
  };

  // Style header kartu
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: title || subtitle ? '16px' : '0',
  };

  // Style ikon di header
  const iconWrapperStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4CAF50',
    flexShrink: 0,
  };

  // Konfigurasi animasi hover
  const hoverAnimation = hoverable
    ? {
        whileHover: {
          y: -4,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.06)',
        },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <motion.div
      className={`card ${className}`}
      style={cardStyle}
      onClick={onClick}
      {...hoverAnimation}
    >
      {/* Header: ikon + judul + subjudul */}
      {(title || subtitle || Icon) && (
        <div style={headerStyle}>
          {Icon && (
            <div style={iconWrapperStyle}>
              <Icon size={20} />
            </div>
          )}
          <div>
            {title && (
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#1F2937',
                lineHeight: '1.3',
              }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{
                margin: '2px 0 0',
                fontSize: '13px',
                color: '#6B7280',
                lineHeight: '1.4',
              }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Konten kartu */}
      {children}
    </motion.div>
  );
});

export default Card;

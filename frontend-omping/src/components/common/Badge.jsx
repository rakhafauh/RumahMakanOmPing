// ============================================================
// Badge.jsx - Komponen badge status
// Digunakan untuk menampilkan status pesanan, peran user, dll.
// ============================================================
import React, { memo } from 'react';

/**
 * Konfigurasi warna untuk setiap variant badge
 */
const variantConfig = {
  success: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    color: '#16A34A',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  warning: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    color: '#D97706',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  danger: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    color: '#DC2626',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  info: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    color: '#2563EB',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  default: {
    backgroundColor: 'rgba(107, 114, 128, 0.12)',
    color: '#4B5563',
    borderColor: 'rgba(107, 114, 128, 0.3)',
  },
};

/**
 * Komponen Badge untuk menampilkan label status
 * @param {string} text - Teks yang ditampilkan
 * @param {string} variant - Jenis warna: success, warning, danger, info, default
 * @param {string} className - Kelas CSS tambahan
 * @param {object} style - Style tambahan
 */
const Badge = memo(function Badge({
  text,
  variant = 'default',
  className = '',
  style: customStyle = {},
}) {
  const config = variantConfig[variant] || variantConfig.default;

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '1.5',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
    border: `1px solid ${config.borderColor}`,
    ...config,
    ...customStyle,
  };

  return (
    <span className={`badge badge-${variant} ${className}`} style={badgeStyle}>
      {text}
    </span>
  );
});

export default Badge;

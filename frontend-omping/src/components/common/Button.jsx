// ============================================================
// Button.jsx - Komponen tombol reusable
// Mendukung berbagai variant, ukuran, ikon, dan loading state
// ============================================================
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Konfigurasi style untuk setiap variant tombol
 */
const variantStyles = {
  primary: {
    backgroundColor: '#4CAF50',
    color: '#ffffff',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#4CAF50',
    border: '2px solid #4CAF50',
  },
  danger: {
    backgroundColor: '#EF4444',
    color: '#ffffff',
    border: 'none',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#4B5563',
    border: 'none',
  },
  success: {
    backgroundColor: '#22C55E',
    color: '#ffffff',
    border: 'none',
  },
};

/**
 * Konfigurasi ukuran tombol
 */
const sizeStyles = {
  sm: {
    padding: '6px 14px',
    fontSize: '13px',
    borderRadius: '6px',
    gap: '4px',
  },
  md: {
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: '8px',
    gap: '6px',
  },
  lg: {
    padding: '14px 28px',
    fontSize: '16px',
    borderRadius: '10px',
    gap: '8px',
  },
};

/**
 * Komponen Button reusable
 * @param {string} variant - Jenis tombol: primary, secondary, danger, ghost, success
 * @param {string} size - Ukuran tombol: sm, md, lg
 * @param {React.Component} icon - Komponen ikon dari lucide-react
 * @param {boolean} loading - Status loading (tampilkan spinner)
 * @param {boolean} disabled - Nonaktifkan tombol
 * @param {boolean} fullWidth - Tombol memenuhi lebar container
 * @param {function} onClick - Handler klik
 * @param {React.ReactNode} children - Konten tombol
 */
const Button = memo(function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  type = 'button',
  className = '',
  style: customStyle = {},
  ...rest
}) {
  // Gabungkan style berdasarkan variant dan ukuran
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'background-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.4',
    width: fullWidth ? '100%' : 'auto',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...customStyle,
  };

  // Ukuran ikon berdasarkan size tombol
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;

  return (
    <motion.button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      style={baseStyle}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.03, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      {...rest}
    >
      {/* Spinner saat loading */}
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          style={{ display: 'inline-flex' }}
        >
          <Loader2 size={iconSize} />
        </motion.span>
      ) : Icon ? (
        <Icon size={iconSize} />
      ) : null}

      {/* Label tombol */}
      {children && <span>{children}</span>}
    </motion.button>
  );
});

export default Button;

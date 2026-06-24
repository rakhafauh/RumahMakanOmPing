// ============================================================
// EmptyState.jsx - Komponen placeholder data kosong
// Ditampilkan saat tidak ada data yang tersedia
// ============================================================
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import Button from './Button';

/**
 * Komponen EmptyState
 * @param {React.Component} icon - Komponen ikon (lucide-react)
 * @param {string} title - Judul pesan kosong
 * @param {string} description - Deskripsi pesan kosong
 * @param {object} action - Konfigurasi tombol aksi: { label, onClick, icon }
 */
const EmptyState = memo(function EmptyState({
  icon: Icon = PackageOpen,
  title = 'Tidak ada data',
  description = 'Belum ada data yang tersedia saat ini.',
  action,
}) {
  return (
    <motion.div
      className="empty-state"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ikon ilustrasi */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(76, 175, 80, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          color: '#9CA3AF',
        }}
      >
        <Icon size={36} strokeWidth={1.5} />
      </div>

      {/* Judul */}
      <h3
        style={{
          margin: '0 0 8px',
          fontSize: '16px',
          fontWeight: '600',
          color: '#374151',
        }}
      >
        {title}
      </h3>

      {/* Deskripsi */}
      <p
        style={{
          margin: '0 0 24px',
          fontSize: '14px',
          color: '#9CA3AF',
          maxWidth: '320px',
          lineHeight: '1.5',
        }}
      >
        {description}
      </p>

      {/* Tombol aksi (opsional) */}
      {action && (
        <Button
          variant="primary"
          size="md"
          icon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
});

export default EmptyState;

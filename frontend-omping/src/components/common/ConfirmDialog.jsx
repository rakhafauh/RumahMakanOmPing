// ============================================================
// ConfirmDialog.jsx - Dialog konfirmasi
// Membungkus komponen Modal untuk aksi konfirmasi (hapus, terima, tolak)
// ============================================================
import React, { memo } from 'react';
import { AlertTriangle, Trash2, CheckCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * Konfigurasi ikon dan warna berdasarkan variant dialog
 */
const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'rgba(239, 68, 68, 0.1)',
    iconColor: '#EF4444',
    confirmVariant: 'danger',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'rgba(245, 158, 11, 0.1)',
    iconColor: '#F59E0B',
    confirmVariant: 'danger',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'rgba(76, 175, 80, 0.1)',
    iconColor: '#4CAF50',
    confirmVariant: 'primary',
  },
  default: {
    icon: AlertTriangle,
    iconBg: 'rgba(107, 114, 128, 0.1)',
    iconColor: '#6B7280',
    confirmVariant: 'primary',
  },
};

/**
 * Komponen ConfirmDialog
 * @param {boolean} isOpen - Status buka/tutup dialog
 * @param {function} onClose - Handler tutup dialog
 * @param {function} onConfirm - Handler konfirmasi
 * @param {string} title - Judul dialog
 * @param {string} message - Pesan dialog
 * @param {string} confirmText - Teks tombol konfirmasi
 * @param {string} cancelText - Teks tombol batal
 * @param {string} variant - Jenis dialog: danger, warning, success, default
 * @param {boolean} loading - Status loading tombol konfirmasi
 */
const ConfirmDialog = memo(function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'default',
  loading = false,
}) {
  const config = variantConfig[variant] || variantConfig.default;
  const IconComponent = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
        }}
      >
        {/* Ikon peringatan */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: config.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: config.iconColor,
          }}
        >
          <IconComponent size={28} />
        </div>

        {/* Pesan konfirmasi */}
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            color: '#6B7280',
            lineHeight: '1.6',
            maxWidth: '300px',
          }}
        >
          {message}
        </p>

        {/* Tombol aksi */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            marginTop: '8px',
          }}
        >
          {/* Tombol batal */}
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          {/* Tombol konfirmasi */}
          <Button
            variant={config.confirmVariant}
            size="md"
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

export default ConfirmDialog;

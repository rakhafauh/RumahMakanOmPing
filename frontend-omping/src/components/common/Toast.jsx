/**
 * Toast.jsx - Komponen notifikasi toast
 * Menampilkan stack notifikasi di pojok kanan atas
 * Otomatis terhubung ke NotificationContext
 */
import React, { memo, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { NotificationContext } from '../../context/NotificationContext';

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    iconColor: '#22C55E',
    textColor: '#166534',
  },
  error: {
    icon: XCircle,
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    iconColor: '#EF4444',
    textColor: '#991B1B',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    iconColor: '#F59E0B',
    textColor: '#92400E',
  },
  info: {
    icon: Info,
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    iconColor: '#3B82F6',
    textColor: '#1E40AF',
  },
};

const toastVariants = {
  initial: { opacity: 0, x: 50, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 50, scale: 0.95, transition: { duration: 0.15 } },
};

const ToastItem = memo(function ToastItem({ toast, onRemove }) {
  const config = typeConfig[toast.type] || typeConfig.info;
  const IconComponent = config.icon;

  useEffect(() => {
    const duration = toast.duration || 4000;
    const timer = setTimeout(() => onRemove(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: '12px',
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        minWidth: '300px',
        maxWidth: '420px',
      }}
    >
      <IconComponent size={20} style={{ color: config.iconColor, flexShrink: 0, marginTop: '1px' }} />
      <div style={{ flex: 1 }}>
        {toast.title && (
          <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: config.textColor }}>
            {toast.title}
          </p>
        )}
        <p style={{ margin: 0, fontSize: '13px', color: config.textColor, opacity: 0.85, lineHeight: '1.4' }}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '24px', height: '24px', borderRadius: '6px', border: 'none',
          backgroundColor: 'transparent', color: config.textColor, cursor: 'pointer',
          opacity: 0.5, padding: 0, flexShrink: 0, transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
});

/**
 * ToastContainer - Otomatis membaca dari NotificationContext
 */
function ToastContainer() {
  const notification = useContext(NotificationContext);
  const toasts = notification?.toasts || [];
  const removeToast = notification?.removeToast || (() => {});

  const content = (
    <div
      style={{
        position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );

  return createPortal(content, document.body);
}

export default ToastContainer;

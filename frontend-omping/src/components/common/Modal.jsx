// ============================================================
// Modal.jsx - Komponen modal overlay
// Mendukung animasi masuk/keluar, portal rendering, dan backdrop blur
// ============================================================
import React, { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Konfigurasi ukuran modal
 */
const sizeConfig = {
  sm: { maxWidth: '400px' },
  md: { maxWidth: '560px' },
  lg: { maxWidth: '720px' },
};

/**
 * Animasi backdrop
 */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Animasi konten modal
 */
const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    transition: { duration: 0.15 },
  },
};

/**
 * Komponen Modal overlay
 * @param {boolean} isOpen - Status buka/tutup modal
 * @param {function} onClose - Handler tutup modal
 * @param {string} title - Judul modal
 * @param {React.ReactNode} children - Konten modal
 * @param {string} size - Ukuran modal: sm, md, lg
 */
const Modal = memo(function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) {
  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Tutup dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop gelap dengan blur */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={onClose}
          />

          {/* Konten modal */}
          <motion.div
            className="modal-content"
            style={{
              position: 'relative',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
              width: '100%',
              ...sizeConfig[size],
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid #F0F0F0',
                flexShrink: 0,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1F2937',
                }}
              >
                {title}
              </h2>

              {/* Tombol tutup */}
              <button
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#F3F4F6';
                  e.target.style.color = '#4B5563';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#9CA3AF';
                }}
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body modal - scrollable */}
            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render melalui portal ke document.body
  return createPortal(modalContent, document.body);
});

export default Modal;

/**
 * HomePage - Halaman Beranda Rumah Makan Om Ping
 * Halaman landing yang shared untuk semua user
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, QrCode, Clock, Leaf, ChevronRight, LogIn } from 'lucide-react';
import logoResto from '../assets/logoResto.png';

const features = [
  { icon: QrCode, title: 'Pesan Mudah', desc: 'Scan QR & langsung pesan dari HP' },
  { icon: Clock, title: 'Cepat & Praktis', desc: 'Tanpa antri, pesanan langsung masuk' },
  { icon: Leaf, title: 'Selalu Segar', desc: 'Bahan berkualitas setiap hari' },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, #5E9E7D 0%, #7BC69B 50%, #82C39B 100%)',
          padding: '60px 24px 48px',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            padding: '10px',
            marginBottom: '16px',
          }}
        >
          <img
            src={logoResto}
            alt="Logo Rumah Makan Om Ping"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '-0.5px',
            margin: '0 0 8px',
          }}
        >
          Rumah Makan Om Ping
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: '15px',
            color: '#ffffff',
            opacity: 0.85,
            margin: '0',
          }}
        >
          Masakan Rumahan Terbaik untuk Keluarga
        </motion.p>

        <motion.button
          onClick={() => navigate('/menu')}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'white',
            color: '#5E9E7D',
            padding: '14px 32px',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            marginTop: '24px',
          }}
        >
          Lihat Menu
          <ChevronRight size={20} />
        </motion.button>
      </motion.section>

      {/* Features Section */}
      <section style={{
        padding: '40px 24px',
        background: '#F6FAF7',
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '22px',
          fontWeight: '700',
          color: '#2D3436',
          marginBottom: '24px',
          marginTop: '0',
        }}>
          Kenapa Pilih Kami?
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          maxWidth: '480px',
          margin: '0 auto',
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px 16px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#EBF7F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: '#5E9E7D',
              }}>
                <f.icon size={24} />
              </div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#2D3436',
                marginBottom: '4px',
                marginTop: '0',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: '12px',
                color: '#636E72',
                lineHeight: '1.4',
                margin: '0',
              }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Staff Login Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'none',
            border: '1px solid #E0E0E0',
            color: '#636E72',
            padding: '10px 20px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#5E9E7D')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#636E72')}
        >
          <LogIn size={16} />
          Masuk sebagai Karyawan
        </button>
      </motion.div>
    </div>
  );
}

export default HomePage;

/**
 * RegistrationForm - Form registrasi pelanggan (Nama & No HP) (Optimasi Lansia/Non-Tech)
 */
import React, { useState } from 'react';
import { User, Phone } from 'lucide-react';

function RegistrationForm({ onSubmit, loading }) {
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!nama.trim()) errs.nama = 'Nama Anda harus diisi!';
    if (!noHp.trim()) errs.noHp = 'Nomor HP harus diisi!';
    else if (!/^[0-9]{9,15}$/.test(noHp.replace(/\D/g, ''))) errs.noHp = 'Nomor HP tidak valid (9 sampai 15 angka)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ nama: nama.trim(), noHp: noHp.replace(/\D/g, '') });
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '16px' }}>
      {/* Kolom Nama */}
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '1rem', fontWeight: '700', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={18} style={{ color: '#2ecc71' }} /> Nama Anda:
        </label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Tulis nama panggilan Anda..."
          style={{
            height: '46px',
            borderRadius: '10px',
            border: errors.nama ? '2px solid #ef4444' : '1.5px solid #cbd5e1',
            padding: '0 14px',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1e293b',
            outline: 'none',
            backgroundColor: '#ffffff'
          }}
        />
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0', fontWeight: '500', lineHeight: '1.4' }}>
          💡 Nama Anda akan dipanggil oleh kasir saat pesanan sudah siap.
        </p>
        {errors.nama && <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', marginTop: '4px' }}>⚠️ {errors.nama}</span>}
      </div>

      {/* Kolom No HP */}
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '1rem', fontWeight: '700', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Phone size={18} style={{ color: '#2ecc71' }} /> Nomor HP / Telepon:
        </label>
        <input
          type="tel"
          value={noHp}
          onChange={(e) => setNoHp(e.target.value)}
          placeholder="Contoh: 081234567890"
          style={{
            height: '46px',
            borderRadius: '10px',
            border: errors.noHp ? '2px solid #ef4444' : '1.5px solid #cbd5e1',
            padding: '0 14px',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1e293b',
            outline: 'none',
            backgroundColor: '#ffffff'
          }}
        />
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0', fontWeight: '500', lineHeight: '1.4' }}>
          💡 Masukkan nomor telepon aktif Anda.
        </p>
        {errors.noHp && <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', marginTop: '4px' }}>⚠️ {errors.noHp}</span>}
      </div>

      {/* Tombol Lanjutkan */}
      <button 
        type="submit" 
        disabled={loading}
        style={{
          width: '100%',
          height: '48px',
          backgroundColor: '#2ecc71',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1.1rem',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(46, 204, 113, 0.25)',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '12px'
        }}
      >
        {loading ? 'MEMPROSES...' : 'Lanjutkan Pesanan'}
      </button>
    </form>
  );
}

export default RegistrationForm;

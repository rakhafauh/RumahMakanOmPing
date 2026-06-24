/**
 * LoginPage - Halaman login untuk karyawan (Owner/Kasir/Dapur)
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, User, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoResto from '../assets/logoResto.png';
import '../styles/customer.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username dan password harus diisi');
      return;
    }

    setLoading(true);
    try {
      const role = await login(username, password);
      // Redirect berdasarkan role
      const routes = { owner: '/owner', kasir: '/kasir', dapur: '/dapur' };
      navigate(routes[role] || '/');
    } catch (err) {
      setError(err.message || 'Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <motion.div
        className="login-card"
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <div className="login-logo">
            <img src={logoResto} alt="Logo Rumah Makan Om Ping" />
          </div>
          <h1>Rumah Makan Om Ping</h1>
          <p>Masuk sebagai Karyawan</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <motion.div
              className="login-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <div className="form-group">
            <label><User size={16} /> Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label><Lock size={16} /> Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-lg btn-full"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <Link to="/" className="login-back">
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}

export default LoginPage;

/**
 * OwnerDashboard - Dashboard utama Owner
 */
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingBag, DollarSign, TrendingUp, Award } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import transactionService from '../../services/transactionService';
import { formatCurrency } from '../../utils/formatCurrency';
import { getPeriodLabel } from '../../utils/formatDate';
import '../../styles/dashboard.css';

const periods = [
  { value: 'hari', label: 'Hari Ini' },
  { value: 'minggu', label: 'Minggu Ini' },
  { value: 'bulan', label: 'Bulan Ini' },
  { value: 'tahun', label: 'Tahun Ini' },
];

function OwnerDashboard() {
  const { karyawan } = useAuth();
  const [period, setPeriod] = useState('bulan');
  const [stats, setStats] = useState({
    totalTransaksi: 0,
    totalPendapatan: 0,
    rataRata: 0,
    menuTerlaris: [],
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await transactionService.getRevenueStats(period);
        setStats(response);
        setChartData(response.chartData || []);
      } catch (error) {
        console.error('Gagal memuat statistik pendapatan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  const topMenu = stats.menuTerlaris && stats.menuTerlaris.length > 0 ? stats.menuTerlaris[0].nama : '-';
  const topCount = stats.menuTerlaris && stats.menuTerlaris.length > 0 ? stats.menuTerlaris[0].qty : 0;

  return (
    <DashboardLayout role="owner">
      <style>{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          color: #64748b;
          font-size: 16px;
        }
      `}</style>

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Selamat datang, {karyawan?.Nama_Karyawan || 'Owner'}</p>
        </div>
        <select
          className="period-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          {periods.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-container">Memuat data dashboard...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#E8F5E9' }}>
                <ShoppingBag size={24} color="#4CAF50" />
              </div>
              <div className="stat-info">
                <span>Jumlah Transaksi</span>
                <h3>{stats.totalTransaksi}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FFF3E0' }}>
                <DollarSign size={24} color="#FF9800" />
              </div>
              <div className="stat-info">
                <span>Pendapatan Kotor</span>
                <h3>{formatCurrency(stats.totalPendapatan)}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#F3E5F5' }}>
                <Award size={24} color="#9C27B0" />
              </div>
              <div className="stat-info">
                <span>Menu Terlaris</span>
                <h3>{topMenu} {topCount > 0 ? `- ${topCount} porsi` : ''}</h3>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="chart-card">
            <h3><TrendingUp size={18} /> Grafik Pendapatan - {getPeriodLabel(period)}</h3>
            <div className="chart-container">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Bar dataKey="pendapatan" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-empty">Belum ada data untuk periode ini</div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default OwnerDashboard;

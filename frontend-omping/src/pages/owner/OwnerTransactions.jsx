/**
 * OwnerTransactions - Riwayat transaksi dengan pencarian
 */
import React, { useState, useEffect } from 'react';
import { FileText, Search } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Badge from '../../components/common/Badge';
import transactionService from '../../services/transactionService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime, isInPeriod } from '../../utils/formatDate';
import '../../styles/dashboard.css';

const periods = [
  { value: 'semua', label: 'Semua' },
  { value: 'hari', label: 'Hari Ini' },
  { value: 'minggu', label: 'Minggu Ini' },
  { value: 'bulan', label: 'Bulan Ini' },
  { value: 'tahun', label: 'Tahun Ini' },
];

function OwnerTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('semua');

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getTransactionHistory();
      setTransactions(data);
    } catch (error) {
      console.error('Gagal memuat transaksi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const filtered = transactions.filter((t) => {
    const customerName = t.Pelanggan?.Nama_Pelanggan || t.orderDetail?.Pelanggan?.Nama_Pelanggan || '-';
    const customerPhone = String(t.Pelanggan?.No_Hp || t.orderDetail?.Pelanggan?.No_Hp || '');

    const matchSearch = search === '' ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      customerPhone.includes(search);

    const matchPeriod = period === 'semua' || isInPeriod(t.Tanggal_Bayar, period);
    return matchSearch && matchPeriod;
  });

  return (
    <DashboardLayout role="owner">
      <style>{`
        .data-table table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .data-table th,
        .data-table td {
          padding: 16px 20px !important;
          vertical-align: middle;
          line-height: 1.5;
        }

        .items-cell span {
          display: inline-block;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          margin-right: 4px;
          margin-bottom: 4px;
          color: #475569;
          font-weight: 500;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          color: #64748b;
          font-size: 16px;
        }
      `}</style>

      <div className="dashboard-header">
        <h1><FileText size={24} /> Riwayat Transaksi</h1>
      </div>

      <div className="toolbar">
        <div className="search-wrapper">
          <Search size={18} />
          <input
            placeholder="Cari nama atau nomor HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="period-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
          {periods.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
        </select>
      </div>

      {loading ? (
        <div className="loading-container">Memuat data transaksi...</div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>No HP</th>
                <th>Pesanan</th>
                <th>Total</th>
                <th>Metode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((t) => {
                const customerName = t.Pelanggan?.Nama_Pelanggan || t.orderDetail?.Pelanggan?.Nama_Pelanggan || '-';
                const customerPhone = t.Pelanggan?.No_Hp || t.orderDetail?.Pelanggan?.No_Hp || '-';
                const orderStatus = t.orderDetail?.Status_Pesan || t.orderStatus || '-';

                return (
                  <tr key={t.Id_Bayar}>
                    <td>{formatDateTime(t.Tanggal_Bayar)}</td>
                    <td>{customerName}</td>
                    <td>{customerPhone}</td>
                    <td className="items-cell">
                      {t.items.map((d, i) => (
                        <span key={i}>{d.Menu?.Nama_Menu || `Menu #${d.Id_Menu}`} x{d.Qty}</span>
                      ))}
                    </td>
                    <td><strong>{formatCurrency(t.Grand_Bayar)}</strong></td>
                    <td><Badge text={t.Metode_Bayar === 'QRIS' ? 'QRIS' : 'Tunai'} variant={t.Metode_Bayar === 'QRIS' ? 'info' : 'default'} /></td>
                    <td><Badge text={orderStatus} variant={orderStatus === 'pesanan selesai' ? 'success' : orderStatus === 'diproses' ? 'info' : 'warning'} /></td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="7" className="empty-cell" style={{ textAlign: 'center', color: '#64748b' }}>Tidak ada data transaksi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export default OwnerTransactions;

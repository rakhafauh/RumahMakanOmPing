/**
 * DapurMenu - Tampilan menu (read-only untuk Dapur)
 */
import React, { useState, useEffect } from 'react';
import { Search, UtensilsCrossed } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Badge from '../../components/common/Badge';
import menuService from '../../services/menuService';
import { formatCurrency } from '../../utils/formatCurrency';
import '../../styles/dashboard.css';

function DapurMenu() {
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await menuService.getAll();
        setMenus(data || []);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Gagal memuat daftar menu');
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const filtered = menus.filter((m) => {
    const matchSearch = (m.Nama_Menu || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'semua' || m.Kategori_Menu === category;
    return matchSearch && matchCat;
  });

  return (
    <DashboardLayout role="dapur">
      <div className="dashboard-header">
        <h1><UtensilsCrossed size={24} /> Daftar Menu</h1>
      </div>

      <div className="toolbar">
        <div className="search-wrapper">
          <Search size={18} />
          <input placeholder="Cari menu..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="period-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="semua">Semua Kategori</option>
          <option value="makanan">Makanan</option>
          <option value="minuman">Minuman</option>
        </select>
      </div>

      {loading ? (
        <p className="empty-text">Memuat menu...</p>
      ) : error ? (
        <p className="empty-text" style={{ color: '#FF8B8B' }}>{error}</p>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Menu</th>
                <th>Harga</th>
                <th>Kategori</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.Id_Menu}>
                  <td>{i + 1}</td>
                  <td>{m.Nama_Menu}</td>
                  <td>{formatCurrency(m.Harga_Menu)}</td>
                  <td>
                    <Badge
                      text={m.Kategori_Menu === 'makanan' ? 'Makanan' : 'Minuman'}
                      variant={m.Kategori_Menu === 'makanan' ? 'success' : 'info'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export default DapurMenu;

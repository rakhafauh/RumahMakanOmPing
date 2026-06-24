/**
 * OwnerMenu - Halaman kelola menu (CRUD)
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, UtensilsCrossed, Utensils } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Badge from '../../components/common/Badge';
import menuService from '../../services/menuService';
import { formatCurrency } from '../../utils/formatCurrency';
import useNotification from '../../hooks/useNotification';
import '../../styles/dashboard.css';

function OwnerMenu() {
  const notification = useNotification();
  const [menus, setMenus] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMenu, setEditMenu] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ Nama_Menu: '', Harga_Menu: '', Kategori_Menu: 'makanan', Gambar_Menu: '' });
  const [imageMode, setImageMode] = useState('file'); // 'file' | 'url'

  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = await menuService.getAll();
      setMenus(data);
    } catch (error) {
      console.error('Gagal memuat data menu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const filtered = menus.filter((m) =>
    m.Nama_Menu.toLowerCase().includes(search.toLowerCase())
  );

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
    const baseUrl = 'https://backendomping-production.up.railway.app';
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleOpenAdd = () => {

    setEditMenu(null);
    setFormData({ Nama_Menu: '', Harga_Menu: '', Kategori_Menu: 'makanan', Gambar_Menu: '' });
    setImageMode('file');
    setShowForm(true);
  };

  const handleOpenEdit = (menu) => {
    setEditMenu(menu);
    setFormData({ 
      Nama_Menu: menu.Nama_Menu, 
      Harga_Menu: String(menu.Harga_Menu), 
      Kategori_Menu: menu.Kategori_Menu,
      Gambar_Menu: menu.Gambar_Menu || ''
    });
    const isUrl = menu.Gambar_Menu && (menu.Gambar_Menu.startsWith('http://') || menu.Gambar_Menu.startsWith('https://'));
    setImageMode(isUrl ? 'url' : 'file');
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert('Ukuran gambar terlalu besar. Maksimum 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, Gambar_Menu: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.Nama_Menu.trim() || !formData.Harga_Menu) return;
    try {
      if (editMenu) {
        await menuService.update(editMenu.Id_Menu, {
          Nama_Menu: formData.Nama_Menu,
          Harga_Menu: parseFloat(formData.Harga_Menu),
          Kategori_Menu: formData.Kategori_Menu,
          Gambar_Menu: formData.Gambar_Menu,
        });
        notification.success('Menu berhasil diperbarui');
      } else {
        await menuService.create({
          Nama_Menu: formData.Nama_Menu,
          Harga_Menu: parseFloat(formData.Harga_Menu),
          Kategori_Menu: formData.Kategori_Menu,
          Gambar_Menu: formData.Gambar_Menu,
        });
        notification.success('Menu baru berhasil ditambahkan');
      }
      setShowForm(false);
      loadMenus();
    } catch (error) {
      console.error('Gagal menyimpan menu:', error);
      notification.error('Gagal menyimpan menu. Pastikan ukuran file gambar tidak terlalu besar.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await menuService.delete(deleteId);
      notification.success('Menu berhasil dihapus');
      setDeleteId(null);
      loadMenus();
    } catch (error) {
      console.error('Gagal menghapus menu:', error);
      notification.error('Menu ini tidak bisa dihapus karena sudah ada di riwayat pesanan pelanggan. Anda bisa mengedit atau menonaktifkannya saja.');
      setDeleteId(null);
    }
  };



  return (
    <DashboardLayout role="owner">
      <style>{`
        .btn-tambah-menu {
          background-color: #82C39B;
          color: white;
          font-weight: 700;
          border: none;
          border-radius: 50px;
          padding: 10px 24px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 6px rgba(130, 195, 155, 0.2), 0 2px 4px rgba(0, 0, 0, 0.06);
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .btn-tambah-menu:hover {
          background-color: #6fb289;
          transform: translateY(-1px);
          box-shadow: 0 6px 12px rgba(130, 195, 155, 0.3), 0 4px 6px rgba(0, 0, 0, 0.08);
        }

        .btn-tambah-menu:active {
          transform: translateY(1px);
        }

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

        .table-actions-container {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .btn-action-custom {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-action-custom:hover {
          background-color: #e2e8f0;
          color: #1e293b;
        }

        .btn-action-custom.danger:hover {
          background-color: #fee2e2;
          color: #ef4444;
          border-color: #fecaca;
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
        <h1><UtensilsCrossed size={24} /> Kelola Menu</h1>
        <button className="btn-tambah-menu" onClick={handleOpenAdd}>
          <Plus size={16} /> Tambah Menu
        </button>
      </div>

      <div className="toolbar">
        <div className="search-wrapper">
          <Search size={18} />
          <input placeholder="Cari menu..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Memuat data menu...</div>
      ) : (
        <>
          <div className="owner-menu-grid">
            {filtered.map((menu) => {
              const imageUrl = getImageUrl(menu.Gambar_Menu);
              return (
                <div key={menu.Id_Menu} className="owner-menu-card">
                  <div className="owner-menu-card__image-container">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={menu.Nama_Menu} 
                        className="owner-menu-card__image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.style.backgroundColor = '#EBF7F0';
                        }}
                      />
                    ) : (
                      <Utensils size={40} strokeWidth={2} />
                    )}
                  </div>
                  <div className="owner-menu-card__body">
                    <div className="owner-menu-card__category">
                      <Badge 
                        text={menu.Kategori_Menu === 'makanan' ? 'Makanan' : 'Minuman'} 
                        variant={menu.Kategori_Menu === 'makanan' ? 'success' : 'info'} 
                      />
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>#{menu.Id_Menu}</span>
                    </div>
                    <h3 className="owner-menu-card__title" style={{ marginTop: '8px', marginBottom: '4px' }}>{menu.Nama_Menu}</h3>
                    <p className="owner-menu-card__price">{formatCurrency(menu.Harga_Menu)}</p>
                    <div className="owner-menu-card__actions">
                      <button className="btn-action-custom" onClick={() => handleOpenEdit(menu)} title="Edit menu">
                        <Pencil size={15} />
                      </button>
                      <button className="btn-action-custom danger" onClick={() => setDeleteId(menu.Id_Menu)} title="Hapus menu">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1.5px solid var(--border)', color: '#64748b' }}>
              Menu tidak ditemukan
            </div>
          )}
        </>
      )}


      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editMenu ? 'Edit Menu' : 'Tambah Menu'}>
        <div className="modal-form">
          <div className="form-group">
            <label className="form-label">Nama Menu</label>
            <input className="form-input" value={formData.Nama_Menu} onChange={(e) => setFormData({ ...formData, Nama_Menu: e.target.value })} placeholder="Nama menu" />
          </div>
          <div className="form-group">
            <label className="form-label">Harga (Rp)</label>
            <input className="form-input" type="number" value={formData.Harga_Menu} onChange={(e) => setFormData({ ...formData, Harga_Menu: e.target.value })} placeholder="25000" />
          </div>
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select className="form-select" value={formData.Kategori_Menu} onChange={(e) => setFormData({ ...formData, Kategori_Menu: e.target.value })}>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Gambar Menu</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button 
                type="button"
                className={`btn ${imageMode === 'file' ? 'btn--primary' : 'btn--secondary'}`}
                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                onClick={() => setImageMode('file')}
              >
                Unggah File Gambar
              </button>
              <button 
                type="button"
                className={`btn ${imageMode === 'url' ? 'btn--primary' : 'btn--secondary'}`}
                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                onClick={() => setImageMode('url')}
              >
                Masukkan Link URL
              </button>
            </div>
            
            {imageMode === 'file' ? (
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="form-input" 
              />
            ) : (
              <input 
                value={formData.Gambar_Menu} 
                onChange={(e) => setFormData({ ...formData, Gambar_Menu: e.target.value })} 
                placeholder="Contoh: https://example.com/gambar.jpg" 
                className="form-input" 
              />
            )}

            {formData.Gambar_Menu && (
              <div style={{ marginTop: '12px', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#F8FAF5' }}>
                <img 
                  src={formData.Gambar_Menu} 
                  alt="Preview" 
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }} 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div>
                  <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 'bold', display: 'block' }}>Preview Gambar</span>
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, Gambar_Menu: '' })}
                    style={{ fontSize: '11px', color: '#e74c3c', border: 'none', background: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Hapus gambar
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', padding: '12px 0 0', borderTop: '1px solid #F0F0F0' }}>
            <button className="btn btn--secondary" onClick={() => setShowForm(false)}>Batal</button>
            <button className="btn btn--primary" onClick={handleSave}>{editMenu ? 'Simpan' : 'Tambah'}</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Menu"
        message="Apakah Anda yakin ingin menghapus menu ini?"
        confirmText="Hapus"
        variant="danger"
      />
    </DashboardLayout>
  );
}

export default OwnerMenu;

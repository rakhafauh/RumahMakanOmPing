/**
 * OwnerUsers - Halaman kelola karyawan (Kasir & Dapur)
 */
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Badge from '../../components/common/Badge';
import userService from '../../services/userService';
import '../../styles/dashboard.css';

function OwnerUsers() {
  const [users, setUsers] = useState([]);
  const [karyawanList, setKaryawanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ nama: '', username: '', password: '', posisi: 'kasir', noHp: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const [allUsers, allKaryawan] = await Promise.all([
        userService.getAllUsers(),
        userService.getAllKaryawan()
      ]);
      setUsers(allUsers);
      setKaryawanList(allKaryawan);
    } catch (error) {
      console.error('Gagal memuat data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Gabungkan user & karyawan
  const staffList = karyawanList.map((k) => {
    const user = users.find((u) => u.Id_User === k.Id_User);
    return { ...k, username: user?.Nama_User || '-' };
  });

  const handleAdd = async () => {
    if (!form.nama.trim() || !form.username.trim() || !form.password.trim()) return;
    try {
      // 1. Buat User
      const userResponse = await userService.createUser({
        Nama_User: form.username,
        Password: form.password,
      });

      // 2. Buat Karyawan dengan Id_User yang dihasilkan
      await userService.createKaryawan({
        Id_User: userResponse.Id_User,
        Nama_Karyawan: form.nama,
        Posisi_Karyawan: form.posisi,
        No_Hp_Karyawan: parseInt(form.noHp) || 0,
      });

      setShowForm(false);
      setForm({ nama: '', username: '', password: '', posisi: 'kasir', noHp: '' });
      loadData();
    } catch (error) {
      console.error('Gagal menambah karyawan:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await userService.deleteKaryawan(deleteTarget.Id_Karyawan);
      if (deleteTarget.Id_User) {
        await userService.deleteUser(deleteTarget.Id_User);
      }
      setDeleteTarget(null);
      loadData();
    } catch (error) {
      console.error('Gagal menghapus karyawan:', error);
    }
  };

  const roleBadge = (posisi) => {
    const map = { owner: 'success', kasir: 'info', dapur: 'warning' };
    return <Badge text={posisi} variant={map[posisi] || 'default'} />;
  };

  return (
    <DashboardLayout role="owner">
      <style>{`
        .btn-tambah-karyawan {
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

        .btn-tambah-karyawan:hover {
          background-color: #6fb289;
          transform: translateY(-1px);
          box-shadow: 0 6px 12px rgba(130, 195, 155, 0.3), 0 4px 6px rgba(0, 0, 0, 0.08);
        }

        .btn-tambah-karyawan:active {
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

        .btn-action-custom-danger {
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

        .btn-action-custom-danger:hover {
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
        <h1><Users size={24} /> Kelola Karyawan</h1>
        <button className="btn-tambah-karyawan" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Tambah Karyawan
        </button>
      </div>

      {loading ? (
        <div className="loading-container">Memuat data karyawan...</div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Username</th>
                <th>Posisi</th>
                <th>No HP</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s, i) => (
                <tr key={s.Id_Karyawan}>
                  <td>{i + 1}</td>
                  <td>{s.Nama_Karyawan}</td>
                  <td>{s.username}</td>
                  <td>{roleBadge(s.Posisi_Karyawan)}</td>
                  <td>{s.No_Hp_Karyawan || '-'}</td>
                  <td>
                    <div className="table-actions-container">
                      {s.Posisi_Karyawan !== 'owner' && (
                        <button className="btn-action-custom-danger" onClick={() => setDeleteTarget(s)}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {staffList.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>Karyawan tidak ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Tambah Karyawan">
        <div className="modal-form">
          <div className="form-group">
            <label className="form-label">Nama Karyawan</label>
            <input className="form-input" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama lengkap" />
          </div>
          <div className="form-group">
            <label className="form-label">Username (untuk login)</label>
            <input className="form-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="username" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="password" />
          </div>
          <div className="form-group">
            <label className="form-label">Posisi</label>
            <select className="form-select" value={form.posisi} onChange={(e) => setForm({ ...form, posisi: e.target.value })}>
              <option value="kasir">Kasir</option>
              <option value="dapur">Dapur (Koki)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">No HP</label>
            <input className="form-input" type="tel" value={form.noHp} onChange={(e) => setForm({ ...form, noHp: e.target.value })} placeholder="081234567890" />
          </div>
          <div className="modal-footer" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', padding: '12px 0 0', borderTop: '1px solid #F0F0F0' }}>
            <button className="btn btn--secondary" onClick={() => setShowForm(false)}>Batal</button>
            <button className="btn btn--primary" onClick={handleAdd}>Tambah</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Karyawan"
        message={`Hapus karyawan "${deleteTarget?.Nama_Karyawan}"?`}
        confirmText="Hapus"
        variant="danger"
      />
    </DashboardLayout>
  );
}

export default OwnerUsers;

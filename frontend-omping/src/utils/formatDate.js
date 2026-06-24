/**
 * Format tanggal ke format Indonesia
 * @param {string|Date} date
 * @returns {string} contoh: '17 Juni 2026'
 */
export function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format tanggal dan waktu
 */
export function formatDateTime(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format waktu saja
 */
export function formatTime(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Cek apakah tanggal masuk dalam periode tertentu
 * @param {string|Date} date - tanggal yang dicek
 * @param {string} period - 'hari'|'minggu'|'bulan'|'tahun'
 */
export function isInPeriod(date, period) {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();

  switch (period) {
    case 'hari': {
      return d.toDateString() === now.toDateString();
    }
    case 'minggu': {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return d >= startOfWeek && d <= now;
    }
    case 'bulan': {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    case 'tahun': {
      return d.getFullYear() === now.getFullYear();
    }
    default:
      return true;
  }
}

/**
 * Dapatkan label periode
 */
export function getPeriodLabel(period) {
  const labels = {
    hari: 'Hari Ini',
    minggu: 'Minggu Ini',
    bulan: 'Bulan Ini',
    tahun: 'Tahun Ini',
  };
  return labels[period] || 'Semua';
}

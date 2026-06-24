/**
 * Utility: Format angka ke format Rupiah
 * Contoh: 25000 → 'Rp 25.000'
 */

/**
 * Format angka ke Rupiah
 * @param {number} amount - Jumlah uang
 * @returns {string} String format Rupiah
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default formatCurrency;

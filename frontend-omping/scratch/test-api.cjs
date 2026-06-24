const axios = require('axios');

async function testBackend() {
  const baseUrl = 'https://backendomping-production.up.railway.app';
  try {
    // 1. Create a customer
    console.log('Creating customer...');
    const customerRes = await axios.post(`${baseUrl}/create/pelanggan`, {
      Nama_Pelanggan: 'Test Pelanggan ' + Math.floor(Math.random() * 1000),
      No_Hp: 6281234567000 + Math.floor(Math.random() * 1000)
    });
    console.log('Customer created:', customerRes.data);
    const customerId = customerRes.data.Id_pelanggan;

    // 2. Create an order with 'pesanan masuk'
    console.log('Creating order with status "pesanan masuk"...');
    try {
      const orderRes = await axios.post(`${baseUrl}/create/pesan`, {
        Id_Pelanggan: customerId,
        Tanggal_Pesan: new Date().toISOString().split('T')[0],
        Total_Bayar: 25000,
        Status_Pesan: 'pesanan masuk'
      });
      console.log('Order created successfully with "pesanan masuk":', orderRes.data);
    } catch (err) {
      console.error('Order creation with "pesanan masuk" failed:', err.response?.data || err.message);
    }

    // 3. Create an order with 'diproses'
    console.log('Creating order with status "diproses"...');
    try {
      const orderRes2 = await axios.post(`${baseUrl}/create/pesan`, {
        Id_Pelanggan: customerId,
        Tanggal_Pesan: new Date().toISOString().split('T')[0],
        Total_Bayar: 25000,
        Status_Pesan: 'diproses'
      });
      console.log('Order created successfully with "diproses":', orderRes2.data);
    } catch (err) {
      console.error('Order creation with "diproses" failed:', err.response?.data || err.message);
    }
  } catch (err) {
    console.error('General error:', err.response?.data || err.message);
  }
}

testBackend();

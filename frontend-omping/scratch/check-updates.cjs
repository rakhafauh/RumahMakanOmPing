const axios = require('axios');

async function checkBackendUpdates() {
  const baseUrl = 'https://backendomping-production.up.railway.app';
  try {
    console.log('Fetching menus...');
    const res = await axios.get(`${baseUrl}/get/menu`);
    console.log('Response:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('API Error Response Status:', err.response.status);
      console.error('API Error Response Data:', err.response.data);
    } else {
      console.error('Network/Other Error:', err.message);
    }
  }
}

checkBackendUpdates();

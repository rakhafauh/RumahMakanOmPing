const BASE_URL = 'https://backendomping-production.up.railway.app';

async function seedUserAndKaryawan(username, password, name, role, phone) {
  try {
    // 1. Create User
    console.log(`Creating user: ${username}...`);
    const userResponse = await fetch(`${BASE_URL}/create/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Nama_User: username, Password: password })
    });
    
    if (!userResponse.ok) {
      const err = await userResponse.json();
      throw new Error(`Failed to create user: ${err.error || userResponse.statusText}`);
    }
    
    const user = await userResponse.json();
    console.log(`User created successfully! ID: ${user.Id_User}`);
    
    // 2. Create Karyawan linked to the User
    console.log(`Creating employee profile for: ${name} (${role})...`);
    const karyawanResponse = await fetch(`${BASE_URL}/create/karyawan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Id_User: user.Id_User,
        Nama_Karyawan: name,
        Posisi_Karyawan: role,
        No_Hp_Karyawan: phone
      })
    });
    
    if (!karyawanResponse.ok) {
      const err = await karyawanResponse.json();
      throw new Error(`Failed to create karyawan: ${err.error || karyawanResponse.statusText}`);
    }
    
    const karyawan = await karyawanResponse.json();
    console.log(`Employee profile created successfully! ID: ${karyawan.Id_Karyawan}\n`);
    
  } catch (error) {
    console.error(`Error for ${username}:`, error.message);
  }
}

async function run() {
  console.log('--- SEEDING LIVE DATABASE ACCOUNT CREDENTIALS ---\n');
  
  // Seed Owner
  await seedUserAndKaryawan('admin', 'admin123', 'Budi Santoso', 'owner', 6281234567890);
  
  // Seed Kasir
  await seedUserAndKaryawan('kasir1', 'kasir123', 'Siti Rahayu', 'kasir', 6281234567891);
  
  // Seed Dapur
  await seedUserAndKaryawan('dapur1', 'dapur123', 'Ahmad Wijaya', 'dapur', 6281234567892);
  
  console.log('--- SEEDING COMPLETED ---');
}

run();

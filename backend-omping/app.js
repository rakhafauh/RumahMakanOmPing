const express = require('express');
require('dotenv').config();
const routers = require('./routes/index');
const db = require('./models');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(routers);


// Sinkronisasi DB dan jalankan server
const PORT = process.env.PORT || 3000;
db.sequelize.sync({ alter: true }).then(async () => {
  try {
    await db.sequelize.query("ALTER TABLE Pesans MODIFY COLUMN Status_Pesan ENUM('pesanan masuk', 'diproses', 'pesanan selesai', 'ditolak');");
    console.log("Database altered: Status_Pesan ENUM updated to include 'ditolak'");
  } catch (err) {
    console.warn("Peringatan: Gagal mengubah ENUM Status_Pesan:", err.message);
  }

  try {
    // Drop old foreign key if exists
    await db.sequelize.query("ALTER TABLE DetailPesans DROP FOREIGN KEY DetailPesans_ibfk_1;");
    console.log("Database altered: Dropped old constraint DetailPesans_ibfk_1");
  } catch (err) {
    // Ignore if it was already dropped or doesn't exist
  }

  try {
    // Recreate foreign key with ON DELETE CASCADE
    await db.sequelize.query("ALTER TABLE DetailPesans ADD CONSTRAINT DetailPesans_ibfk_1 FOREIGN KEY (Id_Pesan) REFERENCES Pesans (Id_Pesan) ON DELETE CASCADE ON UPDATE CASCADE;");
    console.log("Database altered: Created DetailPesans_ibfk_1 with ON DELETE CASCADE");
  } catch (err) {
    console.warn("Peringatan: Gagal menambahkan foreign key CASCADE:", err.message);
  }

  app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
});
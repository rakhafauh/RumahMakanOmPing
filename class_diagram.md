# Dokumentasi Class Diagram - Rumah Makan Om Ping

Dokumen ini berisi diagram kelas (class diagram) dari sistem **Rumah Makan Om Ping** yang mencakup arsitektur **Frontend** (React + Context + Services) dan **Backend** (Sequelize Models).

---

## Apakah Class Diagram Hanya untuk Frontend Saja?

**Tidak.** Class diagram **bukan hanya untuk frontend**. Faktanya, class diagram digunakan untuk menggambarkan struktur statis dari seluruh sistem perangkat lunak:
1.  **Backend (Database / Domain Models)**: Menunjukkan tabel database (atau model OOP seperti Sequelize/Mongoose) beserta relasi antar tabel (seperti *One-to-Many*, *Many-to-Many*, dsb). Ini adalah bagian terpenting dari class diagram untuk memetakan logika bisnis.
2.  **Frontend (Arsitektur Klien)**: Menunjukkan struktur komponen UI, pengelola status state (seperti React Context/Redux), serta modul komunikasi API (Services).

Oleh karena itu, class diagram di bawah ini mencakup **kedua sisi** (Frontend & Backend) agar memberikan gambaran arsitektur sistem secara penuh.

---

## 1. PlantUML Source Code

Anda dapat menyalin kode di bawah ini dan menempelkannya ke editor PlantUML (seperti [PlantText](https://www.planttext.com/) atau ekstensi VS Code PlantUML) untuk merender gambar diagram secara penuh.

```plantuml
@startuml RM_Om_Ping_Class_Diagram

title Diagram Kelas Sistem Rumah Makan Om Ping

' ========================================================
' BACKEND MODELS (Database Relational Schemas via Sequelize)
' ========================================================
package "Backend - Database Models" {
    class Pesan {
        + String(20) Id_Pesan [PK]
        + String(20) Id_Pelanggan [FK]
        + Date Tanggal_Pesan
        + Float Total_Bayar
        + Enum Status_Pesan
    }

    class DetailPesan {
        + String(20) Id_Pesan [PK, FK]
        + String(20) Id_Menu [PK, FK]
        + Integer Qty
    }

    class Menu {
        + String(20) Id_Menu [PK]
        + String(50) Nama_Menu
        + Float Harga_Menu
        + Enum Kategori_Menu
        + String Gambar_Menu
    }

    class Pelanggan {
        + String(20) Id_pelanggan [PK]
        + String(50) Nama_Pelanggan
        + BigInt No_Hp
        + Date Tanggal_Registrasi
    }

    class Daftar {
        + String(20) Id_Daftar [PK]
        + String(20) Id_Pelanggan [FK]
        + Date Tanggal_Daftar
    }

    class Bayar {
        + String(20) Id_Bayar [PK]
        + Date Tanggal_Bayar
        + Enum Metode_Bayar
        + Float Grand_Bayar
        + String(20) Id_Pelanggan [FK]
        + String(20) Id_Karyawan [FK]
        + String(20) Id_Pesan [FK]
    }

    class Karyawan {
        + String(20) Id_Karyawan [PK]
        + String(50) Nama_Karyawan
        + BigInt No_Hp
        + Enum Posisi
        + String(20) Id_User [FK]
    }

    class User {
        + String(20) Id_User [PK]
        + String(50) Username
        + String Password
        + Enum Role
    }
}

' Relasi Database (Backend)
Pelanggan "1" -- "0..*" Pesan : melakukan >
Pelanggan "1" -- "1" Daftar : terdaftar di >
Pesan "1" *-- "1..*" DetailPesan : memiliki >
Menu "1" -- "0..*" DetailPesan : dipesan di >
Pesan "1" -- "0..1" Bayar : dibayar oleh >
Pelanggan "1" -- "0..*" Bayar : menyetor >
Karyawan "1" -- "0..*" Bayar : mengonfirmasi >
User "1" -- "1" Karyawan : memiliki profil <

' ========================================================
' FRONTEND ARCHITECTURE (React Services & State Contexts)
' ========================================================
package "Frontend - State Contexts" {
    class CartContext {
        + Array items
        + Integer totalItems
        + Float totalPrice
        + addItem(menuItem, qty)
        + updateQty(menuId, qty)
        + removeItem(menuId)
        + clearCart()
    }

    class AuthContext {
        + Object karyawan
        + String token
        + login(credentials)
        + logout()
    }

    class OrderContext {
        + Object currentOrder
        + createOrder(orderData)
        + getOrderById(id)
        + setCurrentOrder(order)
    }
}

package "Frontend - API Services" {
    class orderService {
        + getAll()
        + getById(id)
        + create(data)
        + update(id, data)
        + delete(id)
        + createDetail(data)
        + deleteDetail(pesanId, menuId)
    }

    class paymentService {
        + getAll()
        + getById(id)
        + create(data)
        + update(id, data)
        + delete(id)
    }

    class menuService {
        + getAll()
        + getById(id)
        + create(data)
        + update(id, data)
        + delete(id)
    }

    class customerService {
        + create(data)
    }

    class authService {
        + login(username, password)
    }
}

' Hubungan Antara Frontend & Backend
orderService ..> Pesan : manipulasi data
paymentService ..> Bayar : manipulasi data
menuService ..> Menu : manipulasi data
customerService ..> Pelanggan : membuat data
authService ..> User : otentikasi

' Hubungan Internal Frontend
OrderContext ..> orderService : memanggil API
CartContext ..> customerService : pendaftaran saat checkout
AuthContext ..> authService : memanggil login API

@enduml
```

---

## 2. Diagram Visual (Mermaid)

Di bawah ini adalah representasi diagram kelas yang secara otomatis dirender secara visual langsung oleh browser/IDE Anda menggunakan format Mermaid:

```mermaid
classDiagram
    %% Backend Classes
    class Pesan {
        +String Id_Pesan
        +String Id_Pelanggan
        +Date Tanggal_Pesan
        +Float Total_Bayar
        +String Status_Pesan
    }
    class DetailPesan {
        +String Id_Pesan
        +String Id_Menu
        +Integer Qty
    }
    class Menu {
        +String Id_Menu
        +String Nama_Menu
        +Float Harga_Menu
        +String Kategori_Menu
        +String Gambar_Menu
    }
    class Pelanggan {
        +String Id_pelanggan
        +String Nama_Pelanggan
        +BigInt No_Hp
        +Date Tanggal_Registrasi
    }
    class Daftar {
        +String Id_Daftar
        +String Id_Pelanggan
        +Date Tanggal_Daftar
    }
    class Bayar {
        +String Id_Bayar
        +Date Tanggal_Bayar
        +String Metode_Bayar
        +Float Grand_Bayar
        +String Id_Pelanggan
        +String Id_Karyawan
        +String Id_Pesan
    }
    class Karyawan {
        +String Id_Karyawan
        +String Nama_Karyawan
        +BigInt No_Hp
        +String Posisi
        +String Id_User
    }
    class User {
        +String Id_User
        +String Username
        +String Password
        +String Role
    }

    %% Backend Relationships
    Pelanggan "1" --> "*" Pesan : melakukan
    Pelanggan "1" --> "1" Daftar : terdaftar di
    Pesan "1" *-- "*" DetailPesan : memiliki
    Menu "1" --> "*" DetailPesan : dipesan di
    Pesan "1" --> "0..1" Bayar : dibayar oleh
    Pelanggan "1" --> "*" Bayar : menyetor
    Karyawan "1" --> "*" Bayar : mengonfirmasi
    User "1" --> "1" Karyawan : memiliki profil

    %% Frontend Contexts
    class CartContext {
        +Array items
        +Integer totalItems
        +Float totalPrice
        +addItem()
        +updateQty()
        +clearCart()
    }
    class AuthContext {
        +Object karyawan
        +String token
        +login()
        +logout()
    }
    class OrderContext {
        +Object currentOrder
        +createOrder()
        +getOrderById()
    }

    %% Frontend Services
    class orderService {
        +getAll()
        +create()
        +update()
        +delete()
    }
    class paymentService {
        +create()
        +getAll()
    }
    class menuService {
        +getAll()
        +update()
    }

    %% Frontend connections
    OrderContext ..> orderService : uses API
    CartContext ..> customerService : registers guest
    AuthContext ..> authService : checks user
```

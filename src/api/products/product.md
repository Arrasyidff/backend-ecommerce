# Product API Documentation

Dokumentasi ini menjelaskan API endpoints untuk modul Product dalam aplikasi backend.

## Base URL

```
http://localhost:3000/api
```

## Model Data

### Product

```typescript
{
  id: string;            // UUID
  name: string;          // Nama produk
  description?: string;  // Deskripsi produk (opsional)
  price: number;         // Harga produk (tidak boleh negatif)
  stock: number;         // Stok produk (tidak boleh negatif)
  image?: string;        // URL gambar produk (opsional)
  categoryId: string;    // ID kategori (referensi ke Category)
  category: Category;    // Data kategori (tersedia saat include)
  createdAt: Date;       // Tanggal pembuatan
  updatedAt: Date;       // Tanggal update terakhir
}
```

## Endpoints Product

### GET /products

Mengambil daftar produk dengan filter, pagination, dan sorting.

**Query Parameters**

| Parameter   | Tipe    | Deskripsi                                           | Default    |
|-------------|---------|-----------------------------------------------------|------------|
| categoryId  | string  | Filter berdasarkan ID kategori                      | (optional) |
| name        | string  | Filter berdasarkan nama produk (case insensitive)   | (optional) |
| minPrice    | number  | Filter produk dengan harga minimum                  | (optional) |
| maxPrice    | number  | Filter produk dengan harga maksimum                 | (optional) |
| page        | number  | Halaman yang ingin ditampilkan                      | 1          |
| limit       | number  | Jumlah produk per halaman (max 100)                 | 10         |
| sortBy      | string  | Field untuk sorting ('name', 'price', 'createdAt')  | 'createdAt'|
| order       | string  | Arah sorting ('asc', 'desc')                        | 'desc'     |

**Request Examples**

```
GET /api/products
GET /api/products?categoryId=uuid-1
GET /api/products?name=phone
GET /api/products?minPrice=100&maxPrice=1000
GET /api/products?page=2&limit=20
GET /api/products?sortBy=price&order=asc
```

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    {
      "id": "prod-1",
      "name": "Smartphone",
      "description": "Latest smartphone model",
      "price": 999.99,
      "stock": 50,
      "image": "https://example.com/images/smartphone.jpg",
      "categoryId": "uuid-1",
      "category": {
        "id": "uuid-1",
        "name": "Electronics"
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "id": "prod-2",
      "name": "Laptop",
      "description": "Powerful laptop for professionals",
      "price": 1499.99,
      "stock": 20,
      "image": "https://example.com/images/laptop.jpg",
      "categoryId": "uuid-1",
      "category": {
        "id": "uuid-1",
        "name": "Electronics"
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
```

### GET /products/:id

Mengambil detail produk berdasarkan ID.

**Request**

```
GET /api/products/prod-1
```

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "product": {
      "id": "prod-1",
      "name": "Smartphone",
      "description": "Latest smartphone model",
      "price": 999.99,
      "stock": 50,
      "image": "https://example.com/images/smartphone.jpg",
      "categoryId": "uuid-1",
      "category": {
        "id": "uuid-1",
        "name": "Electronics",
        "description": "Electronic devices and gadgets"
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

**Response (404 Not Found)**

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Product not found"
}
```

### POST /products

Membuat produk baru (memerlukan autentikasi & role ADMIN).

**Request**

```
POST /api/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Tablet",
  "description": "Portable tablet for everyday use",
  "price": 499.99,
  "stock": 30,
  "image": "https://example.com/images/tablet.jpg",
  "categoryId": "uuid-1"
}
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "product": {
      "id": "prod-3",
      "name": "Tablet",
      "description": "Portable tablet for everyday use",
      "price": 499.99,
      "stock": 30,
      "image": "https://example.com/images/tablet.jpg",
      "categoryId": "uuid-1",
      "category": {
        "id": "uuid-1",
        "name": "Electronics"
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

**Response (400 Bad Request)**

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Category not found"
}
```

### PUT /products/:id

Memperbarui produk yang ada (memerlukan autentikasi & role ADMIN).

**Request**

```
PUT /api/products/prod-3
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Tablet Pro",
  "price": 599.99,
  "stock": 25
}
```

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "product": {
      "id": "prod-3",
      "name": "Tablet Pro",
      "description": "Portable tablet for everyday use",
      "price": 599.99,
      "stock": 25,
      "image": "https://example.com/images/tablet.jpg",
      "categoryId": "uuid-1",
      "category": {
        "id": "uuid-1",
        "name": "Electronics"
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### DELETE /products/:id

Menghapus produk (memerlukan autentikasi & role ADMIN).

**Request**

```
DELETE /api/products/prod-3
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

## Panduan Penggunaan

### Filter Produk

Anda dapat menggunakan parameter query untuk memfilter produk:

#### Filter berdasarkan Kategori

```
GET /api/products?categoryId=uuid-1
```

#### Filter berdasarkan Nama Produk

```
GET /api/products?name=phone
```
Ini akan menampilkan semua produk yang nama-nya mengandung 'phone' (case insensitive).

#### Filter berdasarkan Harga

```
GET /api/products?minPrice=100&maxPrice=1000
```
Ini akan menampilkan produk dengan harga antara 100 dan 1000.

### Pagination dan Sorting

#### Paginasi

```
GET /api/products?page=2&limit=20
```
Ini akan menampilkan halaman 2 dengan 20 produk per halaman.

#### Sorting

```
GET /api/products?sortBy=price&order=asc
```
Ini akan menampilkan produk yang diurutkan berdasarkan harga dari terendah ke tertinggi.

```
GET /api/products?sortBy=name&order=desc
```
Ini akan menampilkan produk yang diurutkan berdasarkan nama dari Z ke A.

### Kombinasi Filter dan Pagination

Anda dapat mengkombinasikan semua parameter untuk query yang lebih spesifik:

```
GET /api/products?categoryId=uuid-1&minPrice=500&maxPrice=1500&sortBy=price&order=asc&page=1&limit=10
```
Ini akan menampilkan 10 produk pertama dalam kategori Electronics dengan harga antara 500 dan 1500, diurutkan dari harga terendah ke tertinggi.

## Catatan Keamanan

- Semua endpoint untuk membuat (POST), memperbarui (PUT), dan menghapus (DELETE) resource memerlukan autentikasi dengan token JWT.
- Hanya pengguna dengan role ADMIN yang dapat melakukan operasi Create, Update, dan Delete.
- Semua endpoint GET bersifat publik dan dapat diakses tanpa autentikasi.

## Batasan dan Validasi

### Product
- Harga produk tidak boleh negatif
- Stok produk tidak boleh negatif
- Produk harus terkait dengan kategori yang valid
- Nama produk harus memiliki minimal 2 dan maksimal 100 karakter

## Kode Status

- `200 OK`: Request berhasil
- `201 Created`: Resource berhasil dibuat
- `400 Bad Request`: Parameter tidak valid atau constraint dilanggar
- `401 Unauthorized`: Autentikasi diperlukan
- `403 Forbidden`: Tidak memiliki izin yang cukup
- `404 Not Found`: Resource tidak ditemukan
- `500 Internal Server Error`: Terjadi kesalahan di server
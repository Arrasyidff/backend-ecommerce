# Category API Documentation

Dokumentasi ini menjelaskan API endpoints untuk modul Category dalam aplikasi backend.

## Base URL

```
http://localhost:3000/api
```

## Model Data

### Category

```typescript
{
  id: string;            // UUID
  name: string;          // Nama kategori (unik)
  description?: string;  // Deskripsi kategori (opsional)
  createdAt: Date;       // Tanggal pembuatan
  updatedAt: Date;       // Tanggal update terakhir
}
```

## Endpoints Category

### GET /categories

Mengambil daftar semua kategori.

**Request**

```
GET /api/categories
```

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": "uuid-1",
        "name": "Electronics",
        "description": "Electronic devices and gadgets",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      },
      {
        "id": "uuid-2",
        "name": "Clothing",
        "description": "Fashion items",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### GET /categories/:id

Mengambil data kategori berdasarkan ID.

**Request**

```
GET /api/categories/uuid-1
```

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "category": {
      "id": "uuid-1",
      "name": "Electronics",
      "description": "Electronic devices and gadgets",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "products": [
        {
          "id": "prod-1",
          "name": "Smartphone",
          "price": 999.99,
          "stock": 50,
          "categoryId": "uuid-1"
        }
      ]
    }
  }
}
```

**Response (404 Not Found)**

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Category not found"
}
```

### POST /categories

Membuat kategori baru (memerlukan autentikasi & role ADMIN).

**Request**

```
POST /api/categories
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Books",
  "description": "Books and literature"
}
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "category": {
      "id": "uuid-3",
      "name": "Books",
      "description": "Books and literature",
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
  "message": "Category with this name already exists"
}
```

### PUT /categories/:id

Memperbarui kategori yang ada (memerlukan autentikasi & role ADMIN).

**Request**

```
PUT /api/categories/uuid-3
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Books & Literature",
  "description": "Updated description"
}
```

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "category": {
      "id": "uuid-3",
      "name": "Books & Literature",
      "description": "Updated description",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### DELETE /categories/:id

Menghapus kategori (memerlukan autentikasi & role ADMIN).

**Request**

```
DELETE /api/categories/uuid-3
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "status": "success",
  "message": "Category deleted successfully"
}
```

**Response (400 Bad Request)**

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Cannot delete category with existing products"
}
```

## Catatan Keamanan

- Semua endpoint untuk membuat (POST), memperbarui (PUT), dan menghapus (DELETE) resource memerlukan autentikasi dengan token JWT.
- Hanya pengguna dengan role ADMIN yang dapat melakukan operasi Create, Update, dan Delete.
- Semua endpoint GET bersifat publik dan dapat diakses tanpa autentikasi.

## Batasan dan Validasi

### Category
- Nama kategori harus unik
- Nama kategori harus memiliki minimal 2 dan maksimal 100 karakter
- Kategori dengan produk yang terkait tidak dapat dihapus

## Kode Status

- `200 OK`: Request berhasil
- `201 Created`: Resource berhasil dibuat
- `400 Bad Request`: Parameter tidak valid atau constraint dilanggar
- `401 Unauthorized`: Autentikasi diperlukan
- `403 Forbidden`: Tidak memiliki izin yang cukup
- `404 Not Found`: Resource tidak ditemukan
- `500 Internal Server Error`: Terjadi kesalahan di server
# Product & Category API Documentation

Dokumentasi API untuk manajemen produk dan kategori.

## Kategori

### Mendapatkan Semua Kategori

**Endpoint:** `GET /api/categories`  
**Akses:** Public

**Response:**
```json
{
  "status": "success",
  "results": 3,
  "data": [
    {
      "_id": "60d4a4a15f1b2c2a2c2a2c2a",
      "name": "Electronics",
      "slug": "electronics",
      "createdAt": "2023-04-07T10:00:00.000Z",
      "updatedAt": "2023-04-07T10:00:00.000Z"
    },
    ...
  ]
}
```

### Mendapatkan Kategori berdasarkan ID

**Endpoint:** `GET /api/categories/:id`  
**Akses:** Public

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "60d4a4a15f1b2c2a2c2a2c2a",
    "name": "Electronics",
    "slug": "electronics",
    "createdAt": "2023-04-07T10:00:00.000Z",
    "updatedAt": "2023-04-07T10:00:00.000Z"
  }
}
```

### Mendapatkan Kategori berdasarkan Slug

**Endpoint:** `GET /api/categories/slug/:slug`  
**Akses:** Public

**Response:** Sama dengan mendapatkan berdasarkan ID.

### Membuat Kategori Baru

**Endpoint:** `POST /api/categories`  
**Akses:** Admin only

**Request:**
```json
{
  "name": "Fashion",
  "slug": "fashion" // Optional, akan digenerate dari name jika tidak disediakan
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "60d4a4a15f1b2c2a2c2a2c2a",
    "name": "Fashion",
    "slug": "fashion",
    "createdAt": "2023-04-07T10:00:00.000Z",
    "updatedAt": "2023-04-07T10:00:00.000Z"
  }
}
```

### Mengupdate Kategori

**Endpoint:** `PUT /api/categories/:id`  
**Akses:** Admin only

**Request:**
```json
{
  "name": "Fashion & Apparel"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "60d4a4a15f1b2c2a2c2a2c2a",
    "name": "Fashion & Apparel",
    "slug": "fashion-apparel",
    "createdAt": "2023-04-07T10:00:00.000Z",
    "updatedAt": "2023-04-07T11:00:00.000Z"
  }
}
```

### Menghapus Kategori

**Endpoint:** `DELETE /api/categories/:id`  
**Akses:** Admin only

**Response:** Status 204 No Content

## Produk

### Mendapatkan Semua Produk

**Endpoint:** `GET /api/products`  
**Akses:** Public

**Query Parameters:**
- `category`: Filter berdasarkan ID atau slug kategori
- `minPrice`: Filter produk dengan harga minimum
- `maxPrice`: Filter produk dengan harga maksimum
- `search`: Cari produk berdasarkan nama atau deskripsi
- `page`: Halaman (default: 1)
- `limit`: Jumlah produk per halaman (default: 10)

**Contoh:** `GET /api/products?category=electronics&minPrice=100&maxPrice=500&search=smartphone&page=1&limit=5`

**Response:**
```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "total": 8,
    "page": 1,
    "totalPages": 2,
    "limit": 5
  },
  "data": [
    {
      "_id": "60d4a4a15f1b2c2a2c2a2c2a",
      "name": "Smartphone XYZ",
      "price": 399.99,
      "description": "The latest smartphone with amazing features",
      "images": ["image1.jpg", "image2.jpg"],
      "categoryId": {
        "_id": "60d4a4a15f1b2c2a2c2a2c2a",
        "name": "Electronics",
        "slug": "electronics"
      },
      "stock": 50,
      "slug": "smartphone-xyz",
      "createdAt": "2023-04-07T10:00:00.000Z",
      "updatedAt": "2023-04-07T10:00:00.000Z"
    },
    ...
  ]
}
```

### Mendapatkan Produk berdasarkan ID

**Endpoint:** `GET /api/products/:id`  
**Akses:** Public

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "60d4a4a15f1b2c2a2c2a2c2a",
    "name": "Smartphone XYZ",
    "price": 399.99,
    "description": "The latest smartphone with amazing features",
    "images": ["image1.jpg", "image2.jpg"],
    "categoryId": {
      "_id": "60d4a4a15f1b2c2a2c2a2c2a",
      "name": "Electronics",
      "slug": "electronics"
    },
    "stock": 50,
    "slug": "smartphone-xyz",
    "createdAt": "2023-04-07T10:00:00.000Z",
    "updatedAt": "2023-04-07T10:00:00.000Z"
  }
}
```

### Mendapatkan Produk berdasarkan Slug

**Endpoint:** `GET /api/products/slug/:slug`  
**Akses:** Public

**Response:** Sama dengan mendapatkan berdasarkan ID.

### Membuat Produk Baru

**Endpoint:** `POST /api/products`  
**Akses:** Admin only

**Request:**
```json
{
  "name": "Wireless Headphones",
  "price": 149.99,
  "description": "Premium wireless headphones with noise cancellation",
  "images": ["headphone-front.jpg", "headphone-side.jpg"],
  "categoryId": "60d4a4a15f1b2c2a2c2a2c2a",
  "stock": 30,
  "slug": "wireless-headphones" // Optional, akan digenerate dari name jika tidak disediakan
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "60d4a4a15f1b2c2a2c2a2c2a",
    "name": "Wireless Headphones",
    "price": 149.99,
    "description": "Premium wireless headphones with noise cancellation",
    "images": ["headphone-front.jpg", "headphone-side.jpg"],
    "categoryId": {
      "_id": "60d4a4a15f1b2c2a2c2a2c2a",
      "name": "Electronics",
      "slug": "electronics"
    },
    "stock": 30,
    "slug": "wireless-headphones",
    "createdAt": "2023-04-07T10:00:00.000Z",
    "updatedAt": "2023-04-07T10:00:00.000Z"
  }
}
```

### Mengupdate Produk

**Endpoint:** `PUT /api/products/:id`  
**Akses:** Admin only

**Request:**
```json
{
  "price": 129.99,
  "stock": 25
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "60d4a4a15f1b2c2a2c2a2c2a",
    "name": "Wireless Headphones",
    "price": 129.99,
    "description": "Premium wireless headphones with noise cancellation",
    "images": ["headphone-front.jpg", "headphone-side.jpg"],
    "categoryId": {
      "_id": "60d4a4a15f1b2c2a2c2a2c2a",
      "name": "Electronics",
      "slug": "electronics"
    },
    "stock": 25,
    "slug": "wireless-headphones",
    "createdAt": "2023-04-07T10:00:00.000Z",
    "updatedAt": "2023-04-07T11:00:00.000Z"
  }
}
```

### Menghapus Produk

**Endpoint:** `DELETE /api/products/:id`  
**Akses:** Admin only

**Response:** Status 204 No Content

## Autentikasi

Semua endpoint yang memerlukan akses admin harus menyertakan token JWT dalam header Authorization:

```
Authorization: Bearer [your_jwt_token]
```

## Penanganan Error

API mengembalikan error dalam format berikut:

```json
{
  "status": "fail",
  "message": "Error message"
}
```

Atau untuk validasi error:

```json
{
  "status": "fail",
  "message": "Validation failed",
  "errors": {
    "name": "Name is required",
    "price": "Price must be a positive number"
  }
}
```

## Status Codes

- 200: OK - Request berhasil
- 201: Created - Resource berhasil dibuat
- 204: No Content - Request berhasil, tidak ada konten untuk dikembalikan
- 400: Bad Request - Kesalahan dalam request
- 401: Unauthorized - Autentikasi diperlukan
- 403: Forbidden - Tidak memiliki izin untuk akses
- 404: Not Found - Resource tidak ditemukan
- 500: Internal Server Error - Kesalahan server
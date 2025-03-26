📌 Image Server API - TypeScript + Prisma + Docker

Server ini adalah API untuk mengelola gambar, dibangun menggunakan TypeScript, Prisma ORM, dan berjalan dalam Docker.
🚀 Teknologi yang Digunakan

    TypeScript: Supaya lebih aman dan maintainable.

    Prisma ORM: Untuk manajemen database yang efisien.

    Docker: Untuk containerization dan deployment yang mudah.

    Express.js: Framework backend minimalis.

⚙️ Fitur API

    Upload Gambar → POST /api/images/upload

    List Semua Gambar → GET /api/images

    Ambil Gambar Spesifik → GET /api/images/:id

    Hapus Gambar → DELETE /api/images/:id

    🛠️ Setup & Instalasi
1️⃣ Jalankan dengan Docker

Pastikan kamu sudah menginstal Docker dan Docker Compose.
Gunakan perintah berikut untuk menjalankan project:

Ini akan menjalankan:

    Database PostgreSQL (melalui Prisma)

    Server TypeScript dengan Express.js

2️⃣ Jalankan Secara Manual

Jika tidak ingin menggunakan Docker, jalankan perintah berikut:

# Install dependencies
npm install

# Migrate database Prisma
npx prisma migrate dev

# Start server
npm run dev

📝 Prisma Database (PostgreSQL)

Gunakan Prisma untuk mengelola database.
Schema contoh (prisma/schema.prisma):

model Image {
  id        String  @id @default(uuid())
  filename  String
  url       String
  createdAt DateTime @default(now())
}

Lalu jalankan:

npx prisma migrate dev

🚀 Endpoint API
1️⃣ Upload Gambar

    Endpoint: POST /api/images/upload

    Headers:

{
  "Content-Type": "multipart/form-data"
}

Body:

    file: Gambar yang akan diunggah.

Response:

    {
      "image": {
        "id": "uuid",
        "filename": "image_12345.jpeg",
        "url": "/fileimage/image_12345.jpeg",
        "createdAt": "2025-03-26T04:50:32.185Z"
      }
    }

2️⃣ List Semua Gambar

    Endpoint: GET /api/images

    Response:

    [
      {
        "id": "uuid",
        "filename": "image_12345.jpeg",
        "url": "/fileimage/image_12345.jpeg",
        "createdAt": "2025-03-26T04:50:32.185Z"
      }
    ]

📌 Docker Setup
1️⃣ Dockerfile

FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .


RUN npm run build

CMD ["npm", "run", "start"]
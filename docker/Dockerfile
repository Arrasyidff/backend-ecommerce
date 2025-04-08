FROM node:18 AS builder

WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./
RUN npm ci

# Salin seluruh proyek
COPY . .

# Build aplikasi
RUN npx prisma generate
RUN npm run build

# JANGAN generate Prisma client saat build, akan dilakukan saat runtime

FROM node:18-slim

WORKDIR /usr/src/app

# Install dependencies yang diperlukan
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Salin artefak build dan node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production

# PENTING: Generate Prisma client saat runtime dan kemudian jalankan aplikasi
CMD ["sh", "-c", "npx prisma generate && node dist/server.js"]
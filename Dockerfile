# ========================================================
# Dockerfile - SIA Sekolah (Node.js Express + EJS)
# Proyek Praktik Cloud Computing
# ========================================================

# Gunakan Node.js LTS berbasis Alpine Linux yang ringan, kompatibel, dan aman
FROM node:20-alpine

# Konfigurasi environment di dalam container
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json untuk layer caching
COPY package*.json ./

# Install dependencies khusus production secara bersih
RUN npm ci --omit=dev

# Salin seluruh kode sumber aplikasi ke dalam image
COPY . .

# Expose port aplikasi 3000
EXPOSE 3000

# Jalankan server menggunakan server.js sesuai package.json
CMD ["node", "server.js"]

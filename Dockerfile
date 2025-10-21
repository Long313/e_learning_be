# --- Build stage ---
FROM node:20.18.0-alpine AS builder
WORKDIR /app

# Copy package và cài dependencies
COPY package*.json ./
RUN npm install          # install tất cả, đảm bảo pg có trong dependencies

# Copy source
COPY tsconfig.json ./ 
COPY ormconfig.js ./ 
COPY src ./src

# Build TypeScript
RUN npm run build

# --- Production stage ---
FROM node:20.18.0-alpine
WORKDIR /app
ENV NODE_ENV=production

# Cài thêm bash + PostgreSQL client
RUN apk add --no-cache bash postgresql-client

# Copy package và cài dependencies production
COPY package*.json ./
RUN npm ci --only=production

# Copy build từ builder
COPY --from=builder /app/dist ./dist
COPY ormconfig.js ./ 
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Expose port
EXPOSE 3000

# CMD: chờ Postgres sẵn sàng rồi start NestJS
CMD ["bash", "/wait-for-it.sh", "postgres:5432", "--", "node", "dist/main.js"]

# --- Build stage ---
FROM node:20.18.0-alpine AS builder

WORKDIR /app

# Copy package.json và cài dependencies
COPY package*.json ./
RUN npm ci

# Copy config và source code
COPY tsconfig.json ./ 
COPY ormconfig.js ./ 
COPY src ./src

# Build TypeScript
RUN npm run build

# --- Production stage ---
FROM node:20.18.0-alpine

WORKDIR /app
ENV NODE_ENV=production

# Cài bash vì wait-for-it.sh yêu cầu bash
RUN apk add --no-cache bash

# Copy production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy build từ stage builder
COPY --from=builder /app/dist ./dist
COPY ormconfig.js ./ 
COPY .env ./ 

# Copy script wait-for-it để chờ MySQL
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 3000

# CMD: chạy wait-for-it bằng bash, rồi start app
CMD ["bash", "/wait-for-it.sh", "mysql:3306", "--", "node", "dist/main.js"]

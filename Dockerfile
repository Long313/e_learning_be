# --- Build stage ---
FROM node:20.18.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./ 
COPY ormconfig.js ./ 
COPY src ./src
RUN npm run build

# --- Production stage ---
FROM node:20.18.0-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache bash postgresql-client
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY ormconfig.js ./ 
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
EXPOSE 3000
CMD ["bash", "/wait-for-it.sh", "postgres:5432", "--", "node", "dist/main.js"]

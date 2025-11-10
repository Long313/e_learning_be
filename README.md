#  🧰 Project: E-Learning Backend

## 🧩 Phiên bản Node:
    Node v20.18.0

## 💡Công nghệ sử dụng:
 🔹 Server: Nestjs (TypeORM + Typescript), Docker (docker-compose.yml + Dockerfile)
 🔹 Database: Postgres v.15.x (Docker)
 🔹 Swagger


## ⚙️ Hướng dẫn chạy project:
 🔹 Cách 1: Chạy bằng Docker:
    1. Tải Docker Desktop https://www.docker.com/products/docker-desktop/
    2. Tạo 2 file docker-compose.yml và Dockerfile
    3. Chạy lệnh: docker-compose up --build 
  ------------------------------------------------
 🔹 Cách 2: Chạy thủ công (local)
    1. npm install
    2. Kết nối với Postgres (thông tin database ở file .env)
    3. npm run start:dev

## 🚀 Một số câu lệnh hay dùng
 🔹 docker-compose down -v (nếu muốn dừng và xóa toàn bộ container + volume:)
 🔹 docker-compose --env-file .env.docker down -v (hoặc nếu đang dùng file môi trường riêng)

## 🌐 Link server test:
 🔹 Backend Server 🔗: https://e-learning-be-i5i4.onrender.com/api/docs
 🔹 Database Server 🔗: postgresql:admin:tlpDdElvtmk0oLGLShXvoa5lf6yaBqJh@dpg-d3s8tsq4d50c738knbpg-a.        oregon-postgres.render.com/elearningdb_4jt1
 🔹 Frontend Server 🔗: https://e-learning-fe-phi.vercel.app/

## 🧾Lưu ý:
   .env: Chạy project ở local, nếu không chạy bằng Docker
   .env.docker: Nếu chạy project bằng Docker ở local
   .env.prod: Để deploy bằng Docker
_____________________________________________________________________________________________

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
_______________________________________________________________________________________________




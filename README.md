## Phiên bản Node:
  Node v20.18.0

## Tech stack:
  - Server: Nestjs (TypeORM + Typescript), Docker (docker-compose.yml + Dockerfile)
  - Database: + MySQL v8.0
              + Redis v7.0
  - Swagger

## Hướng dẫn chạy project:
  * Chạy bằng Docker:
    1. Tải Docker Desktop
    2. Tạo 2 file docker-compose.yml và Dockerfile
    3. Chạy lệnh: docker-compose up --build 
  ------------------------------------------------
  * Không cần chạy Docker thì:
    1. Sửa file .env 

    Sửa từ
    ------------------------
        # App
        PORT=4000

        # MySQL
        DB_HOST=mysql
        DB_PORT=3306
        DB_USERNAME=admin
        DB_PASSWORD=password
        DB_DATABASE=elearningdb

        # Redis
        REDIS_HOST=redis
        REDIS_PORT=6379

    -----------------------
    thành
    -----------------------
        # App
        PORT=4000

        # MySQL
        DB_HOST=localhost
        DB_PORT=3306
        DB_USERNAME=admin
        DB_PASSWORD=password
        DB_DATABASE=elearningdb

        # Redis
        REDIS_HOST=localhost
        REDIS_PORT=6379
    ------------------------
    2. npm run start:dev
  
## Một số câu lệnh hay dùng
  docker-compose down -v (xoá container và volume MySQL hiện tại)
_______________________________________________________________________________________________

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

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.



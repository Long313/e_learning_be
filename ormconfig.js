module.exports = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_DATABASE || 'e_learning',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true, // chỉ dùng cho dev
    namingStrategy: new (require('typeorm-naming-strategies').SnakeNamingStrategy)(),
};

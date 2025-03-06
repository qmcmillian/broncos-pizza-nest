import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PizzasModule } from './pizzas/pizzas.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'your_db_user',
      password: process.env.DB_PASSWORD || 'your_db_password',
      database: process.env.DB_NAME || 'broncos-pizza-nest',
      autoLoadModels: true,
      synchronize: true,
      logging: false,
      retry: {
        max: 5,
      },
      pool: {
        max: 10,
        min: 0,
        idle: 10000,
        acquire: 30000,
      },
    }),
    PizzasModule,
  ],
})
export class AppModule {}

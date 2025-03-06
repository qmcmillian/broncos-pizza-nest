import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { seedDatabase } from './seeds/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  if (process.env.NODE_ENV !== 'production') {
    try {
      await seedDatabase();
    } catch (err) {
      console.error('Seeding error:', err);
      process.exit(1);
    }
  }

  await app.listen(3000);
  console.log(`Broncos Pizza Server is running on http://localhost:3000`);
}
bootstrap();

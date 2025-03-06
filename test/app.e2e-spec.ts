import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from '../src/app.module';
import { seedDatabase } from '../src/seeds/seed';

describe('End-to-End Pizza API', () => {
  let app: INestApplication;
  let createdPizzaId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Clear the database to ensure a clean slate before tests
    const sequelize: Sequelize = app.get(Sequelize);
    await sequelize.query(
      'TRUNCATE TABLE "pizza_toppings", "pizzas", "sizes", "sauces", "toppings" RESTART IDENTITY CASCADE',
    );

    // Seed the database so that valid choices exist
    await seedDatabase();
  });

  afterAll(async () => {
    // Clear the database at the end of tests
    const sequelize: Sequelize = app.get(Sequelize);
    await sequelize.query(
      'TRUNCATE TABLE "pizza_toppings", "pizzas", "sizes", "sauces", "toppings" RESTART IDENTITY CASCADE',
    );
    await app.close();
  });

  it('should create a pizza', async () => {
    const res = await request(app.getHttpServer())
      .post('/pizzas')
      .send({
        size: 'Large',
        sauce: 'Tomato',
        toppings: ['Cheese', 'Pepperoni'],
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('pizzaId');
    createdPizzaId = res.body.pizzaId;
  });

  it('should return 400 for invalid size', async () => {
    const response = await request(app.getHttpServer())
      .post('/pizzas')
      .send({
        size: 'Giant',
        sauce: 'Tomato',
        toppings: ['Cheese', 'Pepperoni'],
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid size');
  });

  it('should return 400 for invalid sauce', async () => {
    const response = await request(app.getHttpServer())
      .post('/pizzas')
      .send({
        size: 'Large',
        sauce: 'Alfredo',
        toppings: ['Cheese', 'Pepperoni'],
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid sauce');
  });

  it('should return 400 for invalid topping', async () => {
    const response = await request(app.getHttpServer())
      .post('/pizzas')
      .send({
        size: 'Large',
        sauce: 'Tomato',
        toppings: ['Sardines'],
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid topping');
  });

  it('should update the pizza', async () => {
    const res = await request(app.getHttpServer())
      .put(`/pizzas/${createdPizzaId}`)
      .send({
        size: 'Medium',
        sauce: 'Pesto',
        toppings: ['Mushrooms', 'Onions'],
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Pizza updated successfully!');
  });

  it('should retrieve the pizza', async () => {
    const res = await request(app.getHttpServer()).get(
      `/pizzas/${createdPizzaId}`,
    );
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('pizza_id', createdPizzaId);
    expect(res.body).toHaveProperty('size', 'Medium');
    expect(res.body).toHaveProperty('sauce', 'Pesto');
    expect(res.body).toHaveProperty('toppings');
    expect(res.body.toppings).toEqual(
      expect.arrayContaining(['Mushrooms', 'Onions']),
    );
  });

  it('should delete the pizza', async () => {
    const res = await request(app.getHttpServer()).delete(
      `/pizzas/${createdPizzaId}`,
    );
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      `Pizza ${createdPizzaId} deleted successfully`,
    );
  });

  it('should return 404 for a deleted pizza', async () => {
    const res = await request(app.getHttpServer()).get(
      `/pizzas/${createdPizzaId}`,
    );
    expect(res.status).toBe(404);
  });
});

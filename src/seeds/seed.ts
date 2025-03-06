import * as dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize-typescript';
import { Pizza } from '../models/pizza.model';
import { Size } from '../models/size.model';
import { Sauce } from '../models/sauce.model';
import { Topping } from '../models/topping.model';
import { PizzaTopping } from '../models/pizza-topping.model';

export async function seedDatabase() {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 't4_admin',
    password: process.env.DB_PASSWORD || 'transport4',
    database: process.env.DB_NAME || 'broncos_pizza_db',
    logging: false,
  });

  sequelize.addModels([Size, Sauce, Topping, Pizza, PizzaTopping]);
  await sequelize.sync({ force: true });

  console.log('Seeding database...');

  await Size.bulkCreate(
    [{ name: 'Small' }, { name: 'Medium' }, { name: 'Large' }],
    { ignoreDuplicates: true },
  );

  await Sauce.bulkCreate(
    [{ name: 'Tomato' }, { name: 'Pesto' }, { name: 'BBQ' }],
    { ignoreDuplicates: true },
  );

  await Topping.bulkCreate(
    [
      { name: 'Cheese' },
      { name: 'Pepperoni' },
      { name: 'Mushrooms' },
      { name: 'Onions' },
      { name: 'Olives' },
      { name: 'Bacon' },
    ],
    { ignoreDuplicates: true },
  );

  console.log('Seeding complete.');
}

seedDatabase().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});

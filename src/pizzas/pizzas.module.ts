import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PizzaService } from './pizzas.service';
import { PizzaController } from './pizzas.controller';
import { Pizza } from '../models/pizza.model';
import { Size } from '../models/size.model';
import { Sauce } from '../models/sauce.model';
import { Topping } from '../models/topping.model';
import { PizzaTopping } from '../models/pizza-topping.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Pizza, Size, Sauce, Topping, PizzaTopping]),
  ],
  providers: [PizzaService],
  controllers: [PizzaController],
})
export class PizzasModule {}

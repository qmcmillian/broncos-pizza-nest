import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Pizza } from '../models/pizza.model';
import { Size } from '../models/size.model';
import { Sauce } from '../models/sauce.model';
import { Topping } from '../models/topping.model';
import { PizzaTopping } from '../models/pizza-topping.model';
import { validateChoices } from '../validators/validatePizza';

@Injectable()
export class PizzaService {
  constructor(
    @InjectModel(Pizza) private readonly pizzaModel: typeof Pizza,
    @InjectModel(Size) private readonly sizeModel: typeof Size,
    @InjectModel(Sauce) private readonly sauceModel: typeof Sauce,
    @InjectModel(Topping) private readonly toppingModel: typeof Topping,
    @InjectModel(PizzaTopping)
    private readonly pizzaToppingModel: typeof PizzaTopping,
    private readonly sequelize: Sequelize,
  ) {}

  private async getIdByName(
    model: typeof Size | typeof Sauce | typeof Topping,
    name: string,
  ): Promise<number> {
    const record = await model.findOne({ where: { name } });
    if (!record)
      throw new BadRequestException(`Invalid ${model.name} name: ${name}`);
    return record.id;
  }

  async createPizza(
    size: string,
    sauce: string,
    toppings: string[],
  ): Promise<{ pizzaId: number }> {
    await validateChoices(
      size,
      sauce,
      toppings,
      this.sizeModel,
      this.sauceModel,
      this.toppingModel,
    );

    const transaction = await this.sequelize.transaction();
    try {
      const sizeId = await this.getIdByName(this.sizeModel, size);
      const sauceId = await this.getIdByName(this.sauceModel, sauce);
      const toppingIds = await Promise.all(
        toppings.map((t) => this.getIdByName(this.toppingModel, t)),
      );

      const pizza = await this.pizzaModel.create(
        { size_id: sizeId, sauce_id: sauceId },
        { transaction },
      );

      for (const toppingId of toppingIds) {
        await this.pizzaToppingModel.create(
          { pizza_id: pizza.id, topping_id: toppingId },
          { transaction },
        );
      }

      await transaction.commit();
      return { pizzaId: pizza.id };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getPizzaById(pizzaId: number): Promise<any> {
    const result = await this.pizzaModel.findByPk(pizzaId, {
      include: [
        { model: this.sizeModel, attributes: ['name'] },
        { model: this.sauceModel, attributes: ['name'] },
        {
          model: this.toppingModel,
          attributes: ['name'],
          through: { attributes: [] },
        },
      ],
    });
    if (!result)
      throw new NotFoundException(`Pizza with id ${pizzaId} not found`);

    const pizza = result.get({ plain: true });
    return {
      pizza_id: pizza.id,
      size: pizza.size?.name || null,
      sauce: pizza.sauce?.name || null,
      toppings: pizza.toppings
        ? pizza.toppings.map((t: { name: string }) => t.name)
        : [],
    };
  }

  async updatePizza(
    pizzaId: number,
    newSize?: string,
    newSauce?: string,
    newToppings?: string[],
  ) {
    if (newSize || newSauce || (newToppings && newToppings.length > 0)) {
      await validateChoices(
        newSize || '',
        newSauce || '',
        newToppings || [],
        this.sizeModel,
        this.sauceModel,
        this.toppingModel,
      );
    }

    const transaction = await this.sequelize.transaction();
    try {
      const pizza = await this.pizzaModel.findByPk(pizzaId, { transaction });
      if (!pizza)
        throw new NotFoundException(`Pizza with id ${pizzaId} not found`);

      if (newSize)
        pizza.size_id = await this.getIdByName(this.sizeModel, newSize);
      if (newSauce)
        pizza.sauce_id = await this.getIdByName(this.sauceModel, newSauce);

      await pizza.save({ transaction });

      if (newToppings && newToppings.length > 0) {
        await this.pizzaToppingModel.destroy({
          where: { pizza_id: pizzaId },
          transaction,
        });
        const toppingIds = await Promise.all(
          newToppings.map((t) => this.getIdByName(this.toppingModel, t)),
        );
        for (const toppingId of toppingIds) {
          await this.pizzaToppingModel.create(
            { pizza_id: pizza.id, topping_id: toppingId },
            { transaction },
          );
        }
      }

      await transaction.commit();
      return { message: 'Pizza updated successfully!', pizzaId };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async deletePizza(pizzaId: number): Promise<{ message: string }> {
    const transaction = await this.sequelize.transaction();
    try {
      const pizza = await this.pizzaModel.findByPk(pizzaId, { transaction });
      if (!pizza)
        throw new NotFoundException(`Pizza with id ${pizzaId} not found`);

      await this.pizzaToppingModel.destroy({
        where: { pizza_id: pizzaId },
        transaction,
      });
      await pizza.destroy({ transaction });

      await transaction.commit();
      return { message: `Pizza ${pizzaId} deleted successfully` };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

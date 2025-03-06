import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Pizza } from './pizza.model';
import { PizzaTopping } from './pizza-topping.model';

@Table({ tableName: 'toppings', timestamps: false })
export class Topping extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    field: 'id',
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'name',
  })
  declare name: string;

  @BelongsToMany(() => Pizza, () => PizzaTopping)
  pizzas: Pizza[];
}

import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { Pizza } from './pizza.model';
import { Topping } from './topping.model';

@Table({ tableName: 'pizza_toppings', timestamps: false })
export class PizzaTopping extends Model {
  @ForeignKey(() => Pizza)
  @Column({ type: DataType.INTEGER, field: 'pizza_id' })
  declare pizza_id: number;

  @ForeignKey(() => Topping)
  @Column({ type: DataType.INTEGER, field: 'topping_id' })
  declare topping_id: number;
}

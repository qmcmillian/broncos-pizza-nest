import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  DataType,
} from 'sequelize-typescript';
import { Size } from './size.model';
import { Sauce } from './sauce.model';
import { Topping } from './topping.model';
import { PizzaTopping } from './pizza-topping.model';

@Table({ tableName: 'pizzas', timestamps: false })
export class Pizza extends Model {
  @ForeignKey(() => Size)
  @Column({ type: DataType.INTEGER, field: 'size_id' })
  declare size_id: number;

  @ForeignKey(() => Sauce)
  @Column({ type: DataType.INTEGER, field: 'sauce_id' })
  declare sauce_id: number;

  @BelongsTo(() => Size, { foreignKey: 'size_id' })
  size: Size;

  @BelongsTo(() => Sauce, { foreignKey: 'sauce_id' })
  sauce: Sauce;

  @BelongsToMany(() => Topping, () => PizzaTopping)
  toppings: Topping[];
}

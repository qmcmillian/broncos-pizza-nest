import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Pizza } from './pizza.model';

@Table({ tableName: 'sizes', timestamps: false })
export class Size extends Model {
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

  @HasMany(() => Pizza)
  pizzas: Pizza[];
}

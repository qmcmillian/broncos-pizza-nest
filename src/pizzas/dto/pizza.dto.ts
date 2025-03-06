import { IsString, IsArray, ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class PizzaDto {
  @IsString()
  @IsNotEmpty()
  readonly size: string;

  @IsString()
  @IsNotEmpty()
  readonly sauce: string;

  @IsArray()
  @ArrayNotEmpty()
  readonly toppings: string[];
}

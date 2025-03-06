import { IsOptional, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdatePizzaDto {
  @IsOptional()
  @IsString()
  readonly size?: string;

  @IsOptional()
  @IsString()
  readonly sauce?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  readonly toppings?: string[];
}

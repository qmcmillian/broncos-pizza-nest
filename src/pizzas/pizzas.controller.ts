import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PizzaService } from './pizzas.service';
import { PizzaDto } from './dto/pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza-dto';

@Controller('pizzas')
export class PizzaController {
  constructor(private readonly pizzaService: PizzaService) {}

  // Create a new pizza
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createPizza(@Body() pizzaDto: PizzaDto) {
    const { size, sauce, toppings } = pizzaDto;
    try {
      const result = await this.pizzaService.createPizza(size, sauce, toppings);
      return { message: 'Pizza created successfully!', ...result };
    } catch (error) {
      throw new HttpException({ error: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  // Get an existing pizza
  @Get(':id')
  async getPizza(@Param('id') id: number) {
    try {
      const result = await this.pizzaService.getPizzaById(id);
      return result;
    } catch (error) {
      if (error.message && error.message.includes('not found')) {
        throw new HttpException(
          { error: 'Pizza not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        { error: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update an existing pizza
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updatePizza(
    @Param('id') id: number,
    @Body() updatePizzaDto: UpdatePizzaDto,
  ) {
    const { size, sauce, toppings } = updatePizzaDto;
    try {
      const result = await this.pizzaService.updatePizza(
        id,
        size,
        sauce,
        toppings,
      );
      return result;
    } catch (error) {
      throw new HttpException({ error: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  // Delete and existing pizza
  @Delete(':id')
  async deletePizza(@Param('id') id: number) {
    try {
      const result = await this.pizzaService.deletePizza(id);
      return result;
    } catch (error) {
      throw new HttpException({ error: error.message }, HttpStatus.BAD_REQUEST);
    }
  }
}

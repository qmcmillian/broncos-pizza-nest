import { BadRequestException } from '@nestjs/common';
import { Size } from '../models/size.model';
import { Sauce } from '../models/sauce.model';
import { Topping } from '../models/topping.model';

export async function validateChoices(
  size: string,
  sauce: string,
  toppings: string[],
  sizeModel: typeof Size,
  sauceModel: typeof Sauce,
  toppingModel: typeof Topping,
): Promise<void> {
  const sizes = await sizeModel.findAll({ attributes: ['name'] });
  const sauces = await sauceModel.findAll({ attributes: ['name'] });
  const toppingRecords = await toppingModel.findAll({ attributes: ['name'] });

  const validSizes = sizes.map((s) => s.get('name'));
  const validSauces = sauces.map((s) => s.get('name'));
  const validToppings = toppingRecords.map((t) => t.get('name'));

  if (!validSizes.includes(size)) {
    throw new BadRequestException(
      `Invalid size: ${size}. Choose from: ${validSizes.join(', ')}`,
    );
  }
  if (!validSauces.includes(sauce)) {
    throw new BadRequestException(
      `Invalid sauce: ${sauce}. Choose from: ${validSauces.join(', ')}`,
    );
  }
  for (const t of toppings) {
    if (!validToppings.includes(t)) {
      throw new BadRequestException(
        `Invalid topping: ${t}. Choose from: ${validToppings.join(', ')}`,
      );
    }
  }
}

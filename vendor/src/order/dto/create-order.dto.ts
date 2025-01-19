import { IsNotEmpty, IsPositive } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    vendorId: number;

    @IsNotEmpty()
    productId: number;

    @IsNotEmpty()
    @IsPositive()
    quantity: number;
}

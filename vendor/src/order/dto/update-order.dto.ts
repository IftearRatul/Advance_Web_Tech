import { IsNotEmpty } from "class-validator";

export class UpdateOrderDto {
    @IsNotEmpty()
    status: string;
}
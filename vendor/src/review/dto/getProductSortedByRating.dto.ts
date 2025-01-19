import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class GetProductSortedByRatingDto {
    @IsNotEmpty()
    @IsEnum(['ASC', 'DESC'], {message: 'Order must be ASC or DESC'})
    order: 'ASC' | 'DESC';

    @IsNotEmpty()
    @IsOptional()
    productId: number;
}
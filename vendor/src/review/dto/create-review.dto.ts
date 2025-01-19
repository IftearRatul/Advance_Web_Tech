import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
    @IsNotEmpty()
    @IsInt()
    orderId: number;

    @IsNotEmpty()
    @IsInt()
    productId: number;

    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rating: number;

    @IsNotEmpty()
    @IsString()
    comment: string;


}
import { IsDate, IsNotEmpty, IsNumber, Length, Max, Min } from "class-validator";

export class UpdateProductDto {
    @IsNotEmpty({message: 'Product Name is required'})
    @Length(1, 100)
    productname: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    @Length(1, 200, {message: "Catagory must be seleted"})
    category: string;

    @IsNotEmpty()
    stock: number;

    @IsNotEmpty()
    @Min(0)
    @Max(5)
    averageRating: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(100)
    discount: number;
    
    @IsNotEmpty()
    @IsDate()
    discountStart: Date;
    
    @IsNotEmpty()
    @IsDate()
    discountEnd: Date;

}
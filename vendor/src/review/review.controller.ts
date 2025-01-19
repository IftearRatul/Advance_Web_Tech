import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entity/review.entity';
import { GetProductSortedByRatingDto } from './dto/getProductSortedByRating.dto';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post('create')
    async createReview(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewService.createReview(createReviewDto);
    }

    @Get('all')
    async findAll():Promise<Review[]>{
    return this.reviewService.findAll();
    }

    @Patch(':id/reponse')
    async respondToReview(@Param('id') id: number, @Body() updateReviewDto: UpdateReviewDto) {
        return this.reviewService.respondToReview(id, updateReviewDto)
    }

    @Get('product/:productId')
    async getReviewsByProduct(@Param('productId') productId: number) {
        return this.reviewService.getReviewsByProduct(productId);
    }

    @Get('/sorted-product')
    async getProductSortedRating(@Query() query: GetProductSortedByRatingDto) {
        const { order, productId} = query;

        if(productId && isNaN(productId)) {
            throw new BadRequestException('Invalid productId');
        }
        return this.reviewService.getProductSortedByRating(order);
    }

    @Delete(':id')
    async delete(@Param('id') reviewId: number): Promise<void> {
        return this.reviewService.deleteReview(reviewId);
    }
}

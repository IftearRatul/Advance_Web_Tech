import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { OrderService } from 'src/order/order.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @Inject(forwardRef(()=> ProductService))
        private readonly productService: ProductService, 
        private readonly orderService: OrderService,
 ){}
 
 async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { orderId, productId, rating, comment } = createReviewDto;

    const order = await this.orderService.findOne(orderId);
    if(!order || !order.customerId) {
        throw new NotFoundException(`Order with ID ${orderId} not found or missing customer information`); 
    }

    const product = await this.productService.findOne(productId);
    if(!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`); 
    }

    const review = this.reviewRepository.create({orderId, productId, customerId: order.customerId, rating, comment});
    await this.reviewRepository.save(review);

    await this.updateProductAverageRating(productId);

    return review;
}

async findAll(): Promise<Review[]>{
return await this.reviewRepository.find();
}

async updateReview(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if(!review){
        throw new NotFoundException(`Review ID ${id} not found`);
    }

    Object.assign(review, updateReviewDto);

    const updateReview = await this.reviewRepository.save(review);
    await this.updateProductAverageRating(review.product.id);
    return updateReview;
}

async deleteReview(reviewId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId }, relations: ['product'], });
    if(!review){
        throw new NotFoundException(`Review ID ${reviewId} not found`);
    }
    await this.reviewRepository.remove(review);
    await this.updateProductAverageRating(review.product.id);
}

private async updateProductAverageRating(productId: number): Promise<void> {
    const reviews = await this.reviewRepository.find({ where: { product: { id: productId } } });

    const product = await this.productService.findOne(productId);
    if(!product){
        throw new NotFoundException(`Product ID ${productId} not found`);
    }

    if(reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review)=> sum + review.rating, 0);
        product.averageRating = parseFloat((totalRating / reviews.length). toFixed(1));
    } else {
        product.averageRating = 0;
    }

    await this.productService.updateProduct(productId, {
        averageRating: product.averageRating,
        productname: product.productname || '',
        price: product.price || 0,
        category: product.category || '',
        stock: product.stock ||  0,
        discount: product.discount || 0,
        discountStart: product.discountStart || undefined,
        discountEnd: product.discountEnd || undefined
    });
}

async getReviewsByProduct(productId: number): Promise<Review[]> {
  return this.reviewRepository.find({ where: { product: { id: productId } }, order: { rating: 'DESC' } });
}

async respondToReview(reviewId: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId} });
    if(!review){
        throw new NotFoundException(`Review ID ${reviewId} not found`);
    }
    review.response = updateReviewDto.response;
    return this.reviewRepository.save(review);
}

async getProductSortedByRating(order: 'ASC' | 'DESC'): Promise<any[]> {
    const products = await this.productService.findAll();

    const productWithRatings = await Promise.all(
        products.map(async (product) => {
            const reviews = await this.reviewRepository.find({ where: { product: { id: product.id } } , });

            const averageRating =
                reviews.length > 0
                    ? parseFloat(
                          (reviews.reduce((sum, review) => sum + review.rating, 0) /
                              reviews.length).toFixed(1),
                      )
                    : 0;
            return { ...product, averageRating };
        }),
    );

    productWithRatings.sort((a, b)=> {
        if(order === 'ASC') return a.averageRating - b.averageRating;
        return b.averageRating - a.averageRating;
    });

    return productWithRatings;
}
}

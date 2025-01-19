import { Module } from '@nestjs/common';
import { Review } from './entity/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Product } from 'src/product/entity/Product.entity';
import { Order } from 'src/order/entity/order.entity';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';

@Module({
      imports: [TypeOrmModule.forFeature([Review, Product, Order]), ProductModule, OrderModule], 
      exports: [ ReviewService],
      providers: [ReviewService],
      controllers: [ReviewController]
    })
export class ReviewModule {}

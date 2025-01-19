import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/Product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Order } from 'src/order/entity/order.entity';
import { Review } from 'src/review/entity/review.entity';
import { ReviewModule } from 'src/review/review.module';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Review])],
        controllers: [ ProductController],
        exports: [ ProductService],
        providers: [ ProductService]
})
export class ProductModule {}

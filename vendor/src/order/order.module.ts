import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entity/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Product } from 'src/product/entity/Product.entity';
import { Review } from 'src/review/entity/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Vendor, Product]), ProductModule, VendorModule], 
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService]
})
export class OrderModule {}

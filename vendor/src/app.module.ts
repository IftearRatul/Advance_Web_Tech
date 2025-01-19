import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorModule } from './vendor/vendor.module';
import { ProductModule } from './product/product.module';
import { EmailModule } from './email/email.module';
import { OrderModule } from './order/order.module';
import { ReviewModule } from './review/review.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './vendor/entities/vendor.entity';
import { Order } from './order/entity/order.entity';
import { Product } from './product/entity/Product.entity';
import { Review } from './review/entity/review.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'post',
    database: 'Ratul',
    entities: [Vendor, Order, Product, Review],
    synchronize: true,
    autoLoadEntities: true,
    }
),
  TypeOrmModule.forFeature([]), ScheduleModule.forRoot(), VendorModule, ProductModule, EmailModule, OrderModule, ReviewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

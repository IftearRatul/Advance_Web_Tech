import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { ProductService } from 'src/product/product.service';
import { VendorService } from 'src/vendor/vendor.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Review } from 'src/review/entity/review.entity';

@Injectable()
export class OrderService {
    constructor (
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>, 
        @Inject(forwardRef(()=> ProductService))
        private readonly productService: ProductService,
        private readonly vendorService: VendorService,
    ){}

    async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { vendorId, productId, quantity} = createOrderDto;
    
    const vendor = await this.vendorService.findOne(vendorId );
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }
  
    const product = await this.productService.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    
    const totalPrice = product.price*quantity;
    await this.productService.updateStock(productId, -quantity);
    
    const order = this.orderRepository.create({vendorId, productId, quantity, totalPrice});
    return await this.orderRepository.save(order);
    }

    async findOne(id:number): Promise<Order>{
    return await this.orderRepository.findOne({where: {id}});
    }

    async findOrderByVendor(vendorId: number): Promise<Order[]> {
        const vendor = await this.vendorService.findOne(vendorId);
        if(!vendor){
            throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
        }
        return this.orderRepository.find({ where: { vendor } });
    }

    async findOrderByStatus(status: string): Promise<Order[]> {
        return this.orderRepository.find({ where: { status } });
      
    }

    async findOrderByProduct(productId: number): Promise<Order[]> {
        const product = await this.productService.findOne(productId);
        if(!product){
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }
        return this.orderRepository.find({ where: { product } });
    }

    async updateOrderStatus(orderId: number, status:string): Promise<Order> {
        const order= await this.orderRepository.findOne({ where: { id: orderId } });
        if(!order){
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
        if (status === 'canceled') {
            await this.productService.updateStock(order.product.id, order.quantity);
        }

        order.status=status;
        return await this.orderRepository.save(order);
    }

    async getOrderReviews(orderId: number): Promise<Review[]> {
        const order = await this.findOne(orderId);
        if(!order) {
            throw new NotFoundException(`Order ID ${orderId} not found`);
        }
        return order.reviews;
    }

    async deleteOrder(orderId:number): Promise<void>{
        const order= await this.orderRepository.findOne({ where: { id: orderId } });

        if(order.status !== 'completed') {
            await this.productService.updateStock(order.product.id, order.quantity);
        }
        await this.orderRepository.delete(orderId);
    }
}

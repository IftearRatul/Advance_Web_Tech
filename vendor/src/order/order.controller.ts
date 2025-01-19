import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entity/order.entity';

@Controller('order')
export class OrderController {
    constructor (private readonly orderService: OrderService) {}

    @Post('create')
    async createOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.orderService.createOrder(createOrderDto);
    }

    @Get(':id')
    async findOne(@Param('id') id:number): Promise<Order>{
    return this.orderService.findOne(+id);
    }

    @Get('vendor/:vendorId')
    async findOrderByVendor(@Param('vendorId') vendorId: number) {
        return this.orderService.findOrderByVendor(vendorId);
    }

    @Get('status/:status')
    async findOrderByStatus(@Param('status') status: string) {
        return this.orderService.findOrderByStatus(status);
    }

    @Get('product/:productId')
    async findOrderByProduct(@Param('productId') productId: number) {
        return this.orderService.findOrderByProduct(productId);
    }

    @Patch(':id/status')
    async updateOrderStatus(@Param('id') id: number, @Body('status') status: string) {
         return this.orderService.updateOrderStatus(id, status);
    }

    @Get(':id/reviews')
    async getOrderReviews(@Param('id') orderId: number) {
        return this.orderService.getOrderReviews(orderId);
    }

    @Delete(':id')
    async deleteOrder(@Param('id') id:number) {
        return this.orderService.deleteOrder(id);
    }


}

import { Order } from "src/order/entity/order.entity";
import { Product } from "src/product/entity/Product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerId: number;

    @ManyToOne(()=> Product, { eager: true })
    product: Product;

    @Column()
    productId: number;

    @ManyToOne(()=> Order, { eager: true })
    order: Order;

    @Column()
    orderId: number

    @Column()
    rating: number;

    @Column({ type: 'text' })
    comment: string;

    @Column({ type: 'text', nullable: true})
    response: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}
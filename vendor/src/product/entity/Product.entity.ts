import { timestamp } from "rxjs";
import { Order } from "src/order/entity/order.entity";
import { Review } from "src/review/entity/review.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:100})
    productname: string;

    @Column('decimal', {precision: 10, scale: 2})
    price: number;

    @Column({default:0})
    stock: number;

    @Column()
    category: string;

    @OneToMany(()=> Order, order=> order.product)
    orders: Order[];

    @OneToMany(()=> Review, review => review.product, { cascade: true})
    reviews: Review[];

    @Column({ type: 'decimal', precision: 2, scale: 1, default: 0})
    averageRating: number;

    @Column('decimal', { precision: 5, scale: 2, nullable: true})
    discount: number;

    @Column({ type: 'timestamp', nullable: true})
    discountStart: Date;

    @Column({ type: 'timestamp', nullable: true})
    discountEnd: Date;
}
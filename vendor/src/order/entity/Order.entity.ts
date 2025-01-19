import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Vendor } from "src/vendor/entities/vendor.entity";
import { Product } from "src/product/entity/Product.entity";
import { Review } from "src/review/entity/review.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn()
    customerId: number;

    @ManyToOne (()=> Vendor, vendor => vendor.orders, {eager: true, onDelete: 'CASCADE'})
    vendor: Vendor;

    @Column()
    vendorId: number;

    @ManyToOne (()=> Product, product => product.orders, {eager: true, onDelete: 'CASCADE'})
    product: Product;

    @Column()
    productId: number;

    @OneToMany(()=> Review, review => review.order, { cascade: true})
    reviews: Review[];

    @Column()
    quantity: number;

    @Column({ default: 'Pending'})
    status: string;

    @Column({ type:'decimal', precision: 10, scale: 2})
    totalPrice: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
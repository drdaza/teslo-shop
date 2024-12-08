import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {


    @ApiProperty(
        {
            description: 'Product id',
            example: '3375b125-6d8e-4516-b0a7-21a797254fde',
            uniqueItems: true,
        }
    )
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty(
        {
            description: 'title of product',
            example: 'title',
            uniqueItems: true,
        }
    )
    @Column('text', {
        unique: true,
    })
    title: string;


    @ApiProperty({
        description: 'price of product',
        example: 123,
        uniqueItems: true,
        type: 'number',
    })
    @Column('float',{
        default: 0,
    })
    price: number;

    @ApiProperty(
        {
            description: 'description of product',
            example: 'description',
            uniqueItems: true,
            type: 'number',
        }
    )
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;


    @ApiProperty(
        {
            description: 'slug of product',
            example: 'slug',
            uniqueItems: true,
        }
    )
    @Column('text',{
        unique: true,
    })
    slug: string;

    @ApiProperty(
        {
            description: 'stock of product',
            example: 123,
        }
    )
    @Column('int',{
        default: 0,
    })
    stock: number

    @ApiProperty(
        {
            description: 'sizes of product',
            example: ['sizes'],
        }
    )
    @Column('text', {
        array: true,
    })
    sizes: string[];


    @ApiProperty(
        {
            description: 'gender can use',
            example: 'man',
        }
    )
    @Column('text')
    gender: string;


    @ApiProperty({
        description: 'tags of product',
        example: ['tags'],
    })
    @Column('text', {
        array: true,
        default: [],
    })
    tags: string[];


    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User;


    @BeforeInsert()
    checkSlugInsert() {
        let newSlugValue = null;
        if (!this.slug) {
            newSlugValue = this.applySlugRules(this.title);
        }
        else {
            newSlugValue = this.applySlugRules(this.slug);
        }
        this._setSlug(newSlugValue);
    }


    @BeforeUpdate()
    checkSlugUpdate() {
        const newSlugValue = this.applySlugRules(this.slug);
        this._setSlug(newSlugValue);
    }

    private _setSlug(slug: string) {
        this.slug = slug;
    }
    private applySlugRules(stringToNormalize: string) {
        return stringToNormalize.toLowerCase().replaceAll(' ', '_').replaceAll(`'`, '');
    }
    // tags
    // images
}

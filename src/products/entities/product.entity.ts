import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string;


    @Column('float',{
        default: 0,
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;


    @Column('text',{
        unique: true,
    })
    slug: string;

    @Column('int',{
        default: 0,
    })
    stock: number

    @Column('text', {
        array: true,
    })
    sizes: string[];


    @Column('text')
    gender: string;


    @Column('text', {
        array: true,
        default: [],
    })
    tags: string[];


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

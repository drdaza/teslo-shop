import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true,
    })
    email: string;

    @Column({
        type: 'text',
        select: false
    })
    password: string;

    @Column({
        type: 'text'
    })
    fullName: string;

    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @Column({
        type: 'text',
        array: true,
        default: ['user'],
    })
    roles: string[];



    @BeforeInsert()
    checkFieldBeforeInsert() {
        this.setEmaiWithoutUpperValues();
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate() {
        this.setEmaiWithoutUpperValues();
    }

    private setEmaiWithoutUpperValues() {
        this.email = this.email.toLowerCase().trim();
    }
}

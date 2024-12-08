import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {


    @ApiProperty({
        description: 'title of product',
        example: 'title',
        uniqueItems: true,
        nullable: false,
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'price of product',
        example: 123,
        uniqueItems: true,
        type: 'number',
        nullable: false,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'description of product',
        example: 'description',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'slug of product',
        example: 'slug',
    })  
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'stock of product',
        example: 123,
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'sizes of product',
        example: ['sizes'],
        nullable: false,
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];
    
    @ApiProperty({
        description: 'tags of product',
        example: ['tags'],
        nullable: false,
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];
    

    @ApiProperty({
        description: 'images of product',
        example: ['images'],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

     @ApiProperty({
        description: 'gender can use',
        example: 'man',
    })
    @IsIn(["man", "woman", 'kid', 'unisex'])
    gender: string;
}

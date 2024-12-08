import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/paginatio.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);
  
  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly datasource: DataSource,

  ) {}
  
  async create(createProductDto: CreateProductDto, user: User) {

    try {

      const { images = [], ...prductDetails } = createProductDto;

      const product = this.productRepository.create({
        ...prductDetails, 
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user,
      });
      await this.productRepository.save(product);

      return {...product, images};
    }
    catch (error) {
      this.handleDbExpections(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    try {

      const { limit= 10, offset= 0 } = paginationDto;
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
        // TODO: Relactions
      });

      return products.map(product => ({...product, images: this.plainImages(product.images)}));
    } catch (error) {
      this.handleDbExpections(error);
    }
  }

  async findOne(term: string) {

      let product: Product
      if (isUUID(term)) {
        
        product = await this.productRepository.findOneBy({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder('product');
        product = await queryBuilder
          .where(
            "title ILIKE :title or slug ILIKE :slug",
            { title: `%${term}%`, slug: `%${term}%` })
          .leftJoinAndSelect('product.images', 'images')  
          .getOne(); 
      } 

      if (!product) {        
        throw new NotFoundException('Product not found');
      }
      
      return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest} = await this.findOne(term);
    return {
      ...rest, 
      images: this.plainImages(images)
    };

  }

  private plainImages(images: ProductImage[]) {
    return images.map(image => image.url);
  }


  async update(id: string, updateProductDto: UpdateProductDto, user: User) {


    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate
    });
    
    if (!product) throw new NotFoundException(`Product with id: ${id} not found`);
    

    // create query runner
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
  

      if( images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images.map(image => this.productImageRepository.create({ url: image }));
      } 

      product.user = user;

      await queryRunner.manager.save(product);


      await queryRunner.commitTransaction();
      await queryRunner.release();
      // await this.productRepository.save(product);
      
      return this.findOnePlain(id);
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();


      this.handleDbExpections(error);
    }
    
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    try {
      await this.productRepository.remove(product);

    } catch (error) {
      this.handleDbExpections(error);
    }

    return `the product with id: ${id} has been eliminated `;
  }

  private getTermType(term: string) {
    if (!isNaN(+term)) {
      return 'number';
    } else {
      return 'string';
    }
  }

  private handleDbExpections (error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    } 
    
    this.logger.error(error);
        
    throw new InternalServerErrorException('unexpected error, check logs');
  }

  async deleteAllProducts () {
    const query = this.productRepository.createQueryBuilder('product');


    try {
      
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDbExpections(error);
    }
  }


}

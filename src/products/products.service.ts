import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/paginatio.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);
  
  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) {}
  
  async create(createProductDto: CreateProductDto) {

    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
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
        // TODO: Relactions
      });

      return products;
    } catch (error) {
      this.handleDbExpections(error);
    }
  }

  async findOne(id: string) {
      const product = await this.productRepository.findOneBy({ id });      
      if (!product) {        
        throw new NotFoundException('Product not found');
      }
      
      return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
}

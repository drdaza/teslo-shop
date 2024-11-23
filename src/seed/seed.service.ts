import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {


  constructor(
    private readonly productsService: ProductsService,
  ) {}

  async runSeed() {

    this.productsService.deleteAllProducts();

    await this.createProducts();


    return 'seed executed';
  }


  private async createProducts() {
    

    const seedProducts  = initialData.products;

    const insertPromises = [];
    

    seedProducts.forEach(product => {
      insertPromises.push(this.productsService.create(product));
    });
  
  
    await Promise.all(insertPromises);


    return true;
  }
}

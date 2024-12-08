import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';


import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';


import { Repository } from 'typeorm';


@Injectable()
export class SeedService {


  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {

    this.deleteTables();
    const user = await this.insertUsers();
    await this.createProducts(user);


    return 'seed executed';
  }


  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
      .delete()
      .where({})
      .execute();

  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user));
    });

    await this.userRepository.save(users);

    return users[0];
  }


  private async createProducts(user: User) {	
    

    const seedProducts  = initialData.products;

    const insertPromises = [];
    

    seedProducts.forEach(product => {
      insertPromises.push(this.productsService.create(product, user));
    });
  
  
    await Promise.all(insertPromises);


    return true;
  }
}

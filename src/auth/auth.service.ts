import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces';
import { handleDbExpections } from 'src/common/utils/utils-methods';
import { User } from './entities/user.entity';
@Injectable()
export class AuthService {


  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,  
  ) { }
  async create(createUserhDto: CreateUserDto) {

    try {


      const { password, ...rest } = createUserhDto;
      
      const user = this.userRepository.create({ ...rest, password: bcrypt.hashSync(password, 10) });



      await this.userRepository.save(user);

      delete user.password;
      // TODO: return JWT access token

      return {
        ...user, 
        token: this.getJwtToken({ id: user.id })
      };  
    } catch (error) {
      handleDbExpections(error);
    }

  }
  async login(createUserhDto: LoginUserDto) {

    const { email, password } = createUserhDto;

    const user = await this.userRepository.findOne({ 
      where: { email },
      select: { email: true, password: true, id: true }
     });


    if (!user) {
      throw new UnauthorizedException('credentials are invalid');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('credentials are invalid');
    }


    // TODO: return JWT access token
    return {
      ...user, 
      token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken(paylopad: JwtPayload) {

    const token = this.jwtService.sign(paylopad);
    return token;
  }

}

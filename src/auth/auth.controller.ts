import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { GetUser, GetRawRequestHeaders, RoleProtected, Auth } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-token')
  @Auth()
  async checkToken(
    @GetRawRequestHeaders('authorization') rawHeaders: string
  ) {
    const token = rawHeaders.split(' ')[1];
    const userInfo = await this.authService.verifyToken(token);
    return userInfo;
  }

  @Get('test')
  @UseGuards(AuthGuard())
  testingAuth(
    @GetUser('email') userEmail: string,
    @GetUser() user: User,
    @GetRawRequestHeaders('authorization') rawHeaders: string
  ) {
    
    
    
   return {
    ok: true,
    message: 'auth works!',
    userEmail,
    user,
    rawHeaders
   }
  }

  @Get('test2')
  // @SetMetadata('roles', ['admin'])
  @RoleProtected(ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingAuth2(
    @GetUser('email') userEmail: string,
    @GetUser() user: User,
    @GetRawRequestHeaders('authorization') rawHeaders: string
  ) {
    
    
    
   return {
    ok: true,
    message: 'auth works!',
    userEmail,
    user,
    rawHeaders
   }
  }
  @Get('test3')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  testingAuth3(
    @GetUser('email') userEmail: string,
    @GetUser() user: User,
    @GetRawRequestHeaders('authorization') rawHeaders: string
  ) {
    
    
    
   return {
    ok: true,
    message: 'auth works!',
    userEmail,
    user,
    rawHeaders
   }
  }

}

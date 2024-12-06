import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor( private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get<string[]>(META_ROLES, context.getHandler());
    const user = context.switchToHttp().getRequest().user as User;

    if (!user) {
      throw new BadRequestException('user not found (request)');
    }
    let returnStatement = this.existValidRoles(validRoles, user);
    
    if (!returnStatement) {
      throw new ForbiddenException(`User ${user.email} need one of these roles: ${validRoles}`);
    }

    return returnStatement;
  }
  private existValidRoles(validRoles: string[], user: User) {
    let returnStatement = false;

    if (!validRoles || validRoles.length === 0) returnStatement = true;
    else returnStatement = this.isValidRole(validRoles, user);

    return returnStatement;
  }

  private isValidRole(validRoles: string[], user: User) {
    let returnStatement = false;

    user.roles.forEach(role => {
      if (validRoles.includes(role)) {
        returnStatement =  true;
      }
    });

    return returnStatement;
  }
}



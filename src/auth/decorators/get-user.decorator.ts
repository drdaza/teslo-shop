import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator((data: string, context: ExecutionContext) => { 
    

    let returnStatement = null;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    
    if (!user) {
        throw new InternalServerErrorException('user not found (request)');
    }

    if (data) {
        returnStatement = user[data];
    } else {
        returnStatement = user;
    }


  return returnStatement;
});
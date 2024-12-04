import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";

export const handleDbExpections =(error: any): never => {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    } 
    
    Logger.error(error);
        
    throw new InternalServerErrorException('unexpected error, check logs');
  } 
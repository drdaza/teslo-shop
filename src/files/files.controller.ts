import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
// import { FilesInterceptor } from '@nestjs/platform-express'


@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}


  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response, 
    @Param('imageName') imageName: string) {

    const path = this.filesService.getStaticProductImage(imageName);
    

    res.sendFile(path);

  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
    }),
    // limits: {
    //   fileSize: 1024,
    // },
  }))
  uploadFile(
    @UploadedFile() file: Express.Multer.File
  ) {


    console.log(file);
    
    if (!file) {
      throw new BadRequestException('No file was uploaded.');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      fileName: secureUrl,
    };
  }

}

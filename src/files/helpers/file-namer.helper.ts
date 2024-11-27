import { v4 as UUID } from 'uuid';


export const fileNamer = (request: Express.Request, file: Express.Multer.File, callback: Function) => {
  
    // console.log(file);

    if (!file) return callback(new Error('No file was uploaded.'), false);


    
    const mimeType = file.mimetype.split('/');
    const fileExtension = mimeType[mimeType.length - 1];
    
    const fileName = `${UUID()}.${fileExtension}`;

    callback(null, fileName);
}
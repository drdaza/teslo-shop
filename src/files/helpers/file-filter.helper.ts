
export const fileFilter = (request: Express.Request, file: Express.Multer.File, callback: Function) => {
  
    // console.log(file);

    if (!file) return callback(new Error('No file was uploaded.'), false);


    
    const mimeType = file.mimetype.split('/');
    const fileExtension = mimeType[mimeType.length - 1];
    

    if (mimeTypeImages.includes(fileExtension)) {
        return callback(null, true);
    }

    callback(null, false);
}

const mimeTypeImages: string[]= ['jpeg', 'png', 'jpg', 'gif'];
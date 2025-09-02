const multer= require('multer');
const storage = multer.diskStorage({
    destination: ( req,file,cb)=>{
        const allowedFileTypes=['image/jpg','image/png', 'image/jpeg', 'image/svg+xml']
        if(!allowedFileTypes.includes(file.mimetype)){
            cb(new Error("File type is not supported"));
        
        }
        cb(null,'./storage'); //cb (error,sucess)
    },
filename: (req, file,cb)=>{
    cb(null,"pooja" + file.originalname)
}
})
module.exports = {
    multer,
    storage
}
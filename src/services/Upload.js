import multer from "multer"
import path from 'path';
const __dirname = path.resolve();

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/src/public/imgs')
    },
    filename: function(req, file, cb){
        console.log(file);
        cb(null, Date.now()+"-"+file.originalname)
    }
})

const uploader = multer({storage:storage})

export default uploader
import multer from "multer"
import {__dirname} from "../app.js"

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/public/imgs')
    },
    filename: function(req, file, cb){
         cb(null, Date.now()+"-"+file.originalname)
    }
})

const uploader = multer({storage:storage})

export default uploader
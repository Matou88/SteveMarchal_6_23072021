/* Dans ce Middleware :
nous créons une constante storage , à passer à multer comme configuration, qui contient la logique nécessaire 
pour indiquer à multer où enregistrer les fichiers entrants, puis nous exportons ensuite l'élément multer entièrement configuré,
lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image. */

const multer = require('multer'); //multer est un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP.

// Types de fichiers acceptés.
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif"
};

const storage = multer.diskStorage ({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(".")[0].split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        mimeTypeIsValid(extension,req);
        const finalFilename = name +"_"+Date.now()+"."+extension;
        req.body.finalFileName = finalFilename;
        callback(null, finalFilename);
    }
});

module.exports = multer({storage: storage}).single('image'); //Exportation de l'élément multer configuré.

const mimeTypeIsValid = (ext,req) => {
    if(ext!="jpg"&&ext!="jpeg"&&ext!="png"&&ext!="webp"&&ext!="gif") {
        req.body.errorMessage = "Le format de l'image n'est pas valide!";
    }
}
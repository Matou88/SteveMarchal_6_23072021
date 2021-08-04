const express = require('express'); // Importation de express.
const router = express.Router();
//Permet d'enregistrer les routes dans le routeur Express, puis enregistrer celui-ci dans l'application.

const auth = require('../middleware/auth'); // importation du middleware auth.
const multer = require('../middleware/multer-config'); // importation du middleware multer-config.

const sauceCtrl = require('../controllers/sauce'); // importation du controller des sauces.

/* Création des différentes routes dans le routeur. */
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislike);

module.exports = router;  // Exportation du routeur.
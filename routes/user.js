const express = require('express'); // Importation de Express.
const router = express.Router(); 
// Permet d'enregistrer les routes dans le routeur Express, puis enregistrer celui-ci dans l'application.

const userCtrl = require('../controllers/user'); // Importation du controller pour les utilisateurs.

/* Création des routes dans le routeur. */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router; // Exportation du routeur.
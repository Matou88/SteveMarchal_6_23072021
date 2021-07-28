const express = require('express');
/* express est un framework basé sur node js */

const bodyParser = require('body-parser');
/* Pour gérer la demande POST provenant de l'application front-end, nous devrons être capables d'extraire l'objet JSON de la demande.
body parser nous le permet */

const mongoose = require('mongoose');
/* mongoose permet de se connecter à la data base Mongo Db */

const path = require('path');
/*  */

const helmet = require('helmet'); 
/* helmet est un module Node.js qui aide à sécuriser les applications «express» en définissant divers en-têtes HTTP.
Il aide à atténuer les attaques de script intersite, les certificats SSL mal émis, etc...*/

const rateLimit = require("express-rate-limit");
/* Le module Express-rate-limit est un middleware pour Express qui est utilisé pour limiter les demandes répétées aux API publiques 
et / ou aux points de terminaison tels que la réinitialisation de mot de passe. En limitant le nombre de requêtes au serveur, 
nous pouvons empêcher le déni de service ( DoS ) attaque . C'est le type d'attaque dans lequel le serveur est inondé de demandes 
répétées le rendant indisponible pour ses utilisateurs prévus et le fermant finalement.
*/

const sauceRoutes = require('./routes/sauce'); // importation des routes pour les sauces.
const userRoutes = require('./routes/user'); // importation des routes pour les utilisateurs.

mongoose.connect('mongodb+srv://OCuser:nRH8WDW170kPTsvM@pekocko.arwhc.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* L'API est à présent connectée à notre base de données */

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
/* Ces headers permettent :
d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.). */

app.use(bodyParser.json());
app.use(helmet());
app.use(limiter);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const helmet = require('helmet'); 
/* helmet est un module Node.js qui aide à sécuriser les applications «express» en définissant divers en-têtes HTTP.
Il aide à atténuer les attaques de script intersite, les certificats SSL mal émis, etc...*/

const rateLimit = require("express-rate-limit");
/* Le module Express-rate-limit est un middleware pour Express qui est utilisé pour limiter les demandes répétées aux API publiques 
et / ou aux points de terminaison tels que la réinitialisation de mot de passe. En limitant le nombre de requêtes au serveur, 
nous pouvons empêcher le déni de service ( DoS ) attaque . C'est le type d'attaque dans lequel le serveur est inondé de demandes 
répétées le rendant indisponible pour ses utilisateurs prévus et le fermant finalement.
*/

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://OCuser:nRH8WDW170kPTsvM@pekocko.arwhc.mongodb.net/pekocko?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(helmet());
app.use(limiter);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
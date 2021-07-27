const mongoose = require('mongoose'); // importation de mongoose.
const mongooseUniqueValidator = require('mongoose-unique-validator'); // plugin permettant de rendre un champ unique.

/* On crée le schéma pour les sauces, l'id sera définit par MongoDb */
const sauceSchema = mongoose.Schema ({
    userId: { type: String, required: true },
    name: { type: String, required: true, unique: true},
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true }
});

sauceSchema.plugin(mongooseUniqueValidator); // On applique le plugin pour que le nom soit unique.

module.exports = mongoose.model('Sauce', sauceSchema); // On exporte le schéma des sauces.
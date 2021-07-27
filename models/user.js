const mongoose = require('mongoose'); // importation de mongoose.
const uniqueValidator = require('mongoose-unique-validator'); // plugin permettant de rendre un (ou plusieurs) champ(s) unique(s).

/* Création du schéma utilisateurs */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // On applique le plugin pour que l'email soit unique.

module.exports = mongoose.model('User', userSchema); // On exporte le schéma des utilisateurs.
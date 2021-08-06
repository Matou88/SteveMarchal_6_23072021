const Sauce = require("../models/sauce"); // Importation du schéma des sauces.
const fs = require("fs"); // Importation du module 'file system' de Node pour avoir accès aux différentes opérations liées au système de fichier

/************ Création d'une sauce ************/
exports.createSauce = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce); // On stocke les données envoyées par le front-end
  delete sauceObjet._id; // Suppression de l'id envoyé par le front car MongoDb en créera un.
  // Création d'une instance du modèle Sauce.
  const sauce = new Sauce({
      ...sauceObjet,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
  });
  if(!req.body.errorMessage) {
      console.log(req.body.errorMessage)
      sauce.save() // Sauvegarde de la sauce dans la base de données
      .then(() => { 
          res.status(201).json({ message: 'La sauce a été créée avec succès!' });
      })
      .catch(error => { 
          if(error.message.indexOf("to be unique")>0) {
              req.body.errorMessage = "Le nom de cette sauce existe déjà!"; 
          }
          next();
      })
  } else {
      console.log(req.body.errorMessage)
      next();
  }
};

/************ Afficher une seule sauce ************/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

/************ Modifier une sauce ************/
exports.modifySauce = (req, res, next) => {
  console.log(req.file);
  const sauceObject = req.file ? { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`,
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

/************ Supprimer une sauce ************/
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

/************ Afficher toutes les sauces ************/
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => { res.status(200).json(sauces); })
    .catch((error) => { res.status(400).json({ error: error });
  });
};

/************ Gestion des like et dislike ************/
exports.likeDislike = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;

  Sauce.findOne({ _id: sauceId })
  .then(sauce => {
      const values = {
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
          likes: 0,
          dislikes: 0
      }
      switch (like) {
          case 1:  // sauce liked
              values.usersLiked.push(userId);
              break;
          case -1:  // sauce disliked
              values.usersDisliked.push(userId);
              break;
          case 0:  // unlike et undislike
              if (values.usersLiked.includes(userId)) {
                  // unlike
                  const index = values.usersLiked.indexOf(userId);
                  values.usersLiked.splice(index, 1);
              } else {
                  // undislike
                  const index = values.usersDisliked.indexOf(userId);
                  values.usersDisliked.splice(index, 1);
              }
              break;
      };
      // Calcul du nombre de likes / dislikes
      values.likes = values.usersLiked.length;
      values.dislikes = values.usersDisliked.length;
      // Mise à jour de la sauce avec les nouvelles valeurs
      Sauce.updateOne({ _id: sauceId }, values )
          .then(() => res.status(200).json({ message: 'Sauce notée !' }))
          .catch(error => res.status(400).json({ error }))  
  })
  .catch(error => res.status(500).json({ error }));
}
const Sauce = require("../models/sauce");
const fs = require("fs");

/************ Création d'une sauce ************/
exports.createSauce = (req, res, next) => {
  // const sauceObjet = JSON.parse(req.body.sauce);
  // console.log(sauceObjet)
  // delete sauceObjet._id;
  // const sauce = new Sauce({
  //     ...sauceObjet,
  //     likes: 0,
  //     dislikes: 0,
  //     usersLiked: [],
  //     usersDisliked: [],
  //     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  // });
  // console.log(sauce)
  next();
  // if(!req.body.errorMessage) {
  //     sauce.save()
  //     .then(() => { 
  //         res.status(201).json({ message: 'La sauce a été créée avec succès!' }); 
  //     })
  //     .catch(error => { 
  //         if(error.message.indexOf("to be unique")>0) {
  //             req.body.errorMessage = "Le nom de cette sauce existe déjà!";
  //         }
  //         next();
  //     })
  // } else {
  //     next();
  // }
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
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
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
      const newValues = {
          userLiked: sauce.userLiked,
          userDisliked: sauce.userDisliked,
          likes: 0,
          dislikes: 0
      }
      switch (like) {
          case 1:  // sauce liked
              newValues.userLiked.push(userId);
              break;
          case -1:  // sauce disliked
              newValues.userDisliked.push(userId);
              break;
          case 0:  // unlike et undislike
              if (newValues.userLiked.includes(userId)) {
                  // unlike
                  const index = newValues.userLiked.indexOf(userId);
                  newValues.userLiked.splice(index, 1);
              } else {
                  // undislike
                  const index = newValues.userDisliked.indexOf(userId);
                  newValues.userDisliked.splice(index, 1);
              }
              break;
      };
      // Calcul du nombre de likes / dislikes
      newValues.likes = newValues.userLiked.length;
      newValues.dislikes = newValues.userDisliked.length;
      // Mise à jour de la sauce avec les nouvelles valeurs
      Sauce.updateOne({ _id: sauceId }, newValues )
          .then(() => res.status(200).json({ message: 'Sauce notée !' }))
          .catch(error => res.status(400).json({ error }))  
  })
  .catch(error => res.status(500).json({ error }));
}
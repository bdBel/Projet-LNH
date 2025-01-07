const cron = require('node-cron');
const insererUpdateJoueur = require('./InformationApi');
// Planifier la tâche cron pour exécuter les fonctions qui ont besoin de mise a jour toutes les 24 heures 3h du matin
cron.schedule('0 3 * * *', () => {
    console.log('Exécution de la tâche cron pour mettre à jour les données des joueurs');
    insererUpdateJoueur();
  });

// Appeler la fonction pour récupérer et insérer les joueurs
insererUpdateJoueur();
//Ajout des fonction equipe et statistique
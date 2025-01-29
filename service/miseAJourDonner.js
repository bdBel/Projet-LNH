const cron = require('node-cron');
const insererUpdateJoueur = require('./InformationApi');
const getVideoIds = require('./videoService');
// Planifier la tâche cron pour exécuter les fonctions qui ont besoin de mise a jour toutes les 24 heures 3h du matin
cron.schedule('0 4 * * *', () => {
    console.log('Exécution de la tâche cron pour mettre à jour les données des joueurs');
    insererUpdateJoueur(); 
    getVideoIds();
    console.log('Données des joueurs mises à jour: \n -Joueur \n -Video');
});
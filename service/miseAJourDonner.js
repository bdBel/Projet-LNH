const cron = require('node-cron');
const { getVideoIds } = require('./videoService'); // Assurez-vous que le chemin est correct

// Planifier la tâche cron pour exécuter les fonctions qui ont besoin de mise à jour toutes les 24 heures à 4h du matin
cron.schedule('0 4 * * *', () => {
    console.log('Exécution de la tâche cron pour mettre à jour les données des joueurs');
    
    getVideoIds()
        .then(() => {
            console.log('Données des joueurs mises à jour: \n -Joueur \n -Video');
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour des vidéos:', error);
        });
});
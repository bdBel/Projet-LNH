const axios = require('axios');

const getGamesLive = async () => {
    const API_URL = 'https://api-web.nhle.com/v1/scoreboard/now';
    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        const getAllowedDays = (baseDate) => {
            // Crée une date locale basée sur le fuseau horaire
            const localDate = new Date(baseDate);
            const yesterday = new Date(localDate);
            const tomorrow = new Date(localDate);
        
            // Ajuste les jours pour hier et demain
            yesterday.setDate(localDate.getDate() - 1);
            tomorrow.setDate(localDate.getDate() + 1);
        
            // Formate les dates au format YYYY-MM-DD (locale)
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ajoute un 0 si nécessaire
                const day = date.getDate().toString().padStart(2, '0'); // Ajoute un 0 si nécessaire
                return `${year}-${month}-${day}`;
            };
        
            return [
                formatDate(localDate),   // Aujourd'hui
                formatDate(yesterday),  // Hier
                formatDate(tomorrow)    // Demain
            ];
        };
        

        // Calcul des jours autorisés
        const allowedDays = getAllowedDays(new Date());

        // Transformer les données de l'API
        const gamesByDate = data.gamesByDate.map(dateEntry => ({
            date: dateEntry.date, // Date au format "YYYY-MM-DD"
            games: dateEntry.games.map(game => {
                // Formatage du startTimeUTC
                const startTime = new Date(game.startTimeUTC);
                const AmPM = startTime.getHours() >= 12 ? ' PM' : ' AM';
                const formattedTime = (startTime.getHours() < 10 ? '0' : '') + startTime.getHours() + ':' + (startTime.getMinutes() < 10 ? '0' : '') + startTime.getMinutes() + AmPM;
                const today = startTime.getDate();

                return {
                    id: game.id,
                    gameState: game.gameState,
                    recapLink: game.threeMinRecap,
                    today: today,
                    dateGame: game.gameDate, // La date du match au format "YYYY-MM-DD"
                    startTime: game.startTimeUTC,
                    formattedStartTime: formattedTime,
                    homeTeam: {
                        name: game.homeTeam.name.default,
                        abbrev: game.homeTeam.abbrev,
                        score: game.homeTeam.score,
                        logo: game.homeTeam.logo
                    },
                    awayTeam: {
                        name: game.awayTeam.name.default,
                        abbrev: game.awayTeam.abbrev,
                        score: game.awayTeam.score,
                        logo: game.awayTeam.logo
                    }
                };
            })
        }));   

        // Filtrage des jeux en fonction des jours autorisés
        const filteredGames = gamesByDate.filter(dateEntry => allowedDays.includes(dateEntry.date));

        // Retourner les jeux filtrés
        return filteredGames;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
        throw new Error('Impossible de récupérer les données des matchs.');
    }
};

const getSummary = async (id) => {
    const API_URL = `https://api-web.nhle.com/v1/gamecenter/${id}/landing`;

    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        return data; // Retourner les données après modification
    } catch (error) {
        console.error('Erreur lors de la récupération des données dans le service :', error.message);
        throw new Error('Impossible de récupérer les données du match.');
    }
};





module.exports = { getGamesLive,getSummary};

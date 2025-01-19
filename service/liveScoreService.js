const axios = require('axios');



const getGamesLive = async () => {
    const API_URL = 'https://api-web.nhle.com/v1/scoreboard/now';
    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        // Obtenez la date actuelle au format "YYYY-MM-DD"
        const today = new Date().toISOString().split('T')[0];

        // Transformer les données
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
                    date: game.gameDate,
                    status: game.status,
                    startTime: game.startTimeUTC,
                    formattedStartTime: formattedTime,  // Heure formatée
                    day: today,  // Jour formaté
                    period: game.period,
                    periodDescriptor: {
                        number: game.periodDescriptor
                    },
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
        return gamesByDate;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
        throw new Error('Impossible de récupérer les données des matchs.');
    }
};

const getSumary = async (id) => {
    const API_URL = `https://api-web.nhle.com/v1/gamecenter/${id}/landing`;
    
    try {
        const response = await axios.get(API_URL);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données: dans le service ', error.message);
        throw new Error('Impossible de récupérer les données des matchs. dans le service');
    }
};





module.exports = { getGamesLive,getSumary};

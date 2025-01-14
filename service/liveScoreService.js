const axios = require('axios');

const API_URL = 'https://api-web.nhle.com/v1/scoreboard/now';

const getGamesLive = async () => {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;
        
        // Transformer les données si nécessaire
        const gamesByDate = data.gamesByDate.map(dateEntry => ({
            date: dateEntry.date,
            games: dateEntry.games.map(game => ({
                id: game.id,
                date: game.gameDate,
                venue: game.venue.default,
                status: game.status,
                startTime:game.startTimeUTC,
                period: game.period,
                periodDescriptor:{
                    number: game.periodDescriptor
                    //periodType: game.periodDescriptor.periodType,
                    //maxRegulationPeriods: game.periodDescriptor
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
            }))
        }));
        
        return gamesByDate;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
        throw new Error('Impossible de récupérer les données des matchs.');
    }
};

module.exports = { getGamesLive };

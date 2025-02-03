const axios = require('axios');

const getGamesLive = async () => {
    const API_URL = 'https://api-web.nhle.com/v1/scoreboard/now';
    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        const getAllowedDays = (baseDate) => {
            const localDate = new Date(baseDate);
            const yesterday = new Date(localDate);
            const tomorrow = new Date(localDate);
        
            yesterday.setDate(localDate.getDate() - 1);
            tomorrow.setDate(localDate.getDate() + 1);
        
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
        
            return [
                formatDate(localDate),
                formatDate(yesterday),
                formatDate(tomorrow)
            ];
        };
        
        const allowedDays = getAllowedDays(new Date());

        const gamesByDate = data.gamesByDate.map(dateEntry => ({
            date: dateEntry.date,
            games: dateEntry.games.map(game => {
                const startTime = new Date(game.startTimeUTC);
                const AmPM = startTime.getHours() >= 12 ? ' PM' : ' AM';
                const formattedTime = (startTime.getHours() < 10 ? '0' : '') + startTime.getHours() + ':' + (startTime.getMinutes() < 10 ? '0' : '') + startTime.getMinutes() + AmPM;
                const today = startTime.getDate();

                return {
                    id: game.id,
                    gameState: game.gameState,
                    recapLink: game.threeMinRecap,
                    today: today,
                    dateGame: game.gameDate,
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

        const filteredGames = gamesByDate.filter(dateEntry => allowedDays.includes(dateEntry.date));

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

        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données dans le service :', error.message);
        throw new Error('Impossible de récupérer les données du match.');
    }
};

const getMatchData = async (gameId) => {
    const API_URL = `https://api-web.nhle.com/v1/gamecenter/${gameId}/landing`;
    try {
        const response = await axios.get(API_URL);
        if (response.data && response.data.summary) {
            return response.data;
        } else {
            throw new Error('Invalid match data structure');
        }
    } catch (error) {
        console.error(`Error fetching match data for ${gameId}: ${error.message}`);
        throw error;
    }
};

const getGamesByDate = async (date) => {
    const API_URL = `https://api-web.nhle.com/v1/score/${date}`;
    try {
        const response = await axios.get(API_URL);
        return response.data.games;
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
};

module.exports = {  
    getGamesLive,
    getGamesByDate,
    getMatchData,
    getSummary,
};
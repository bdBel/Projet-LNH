//GET GAMES LIVE TESTS 

const { getGamesLive } = require('./liveScoreService'); 
const axios = require('axios');

//simuler appel à l'API
jest.mock('axios');
//test de la fonction getGamesLive en simulant un appel réussi à l'API

describe('getGamesLive', () => {
    it('doit retourner les matchs filtrés pour hier, aujourd\'hui et demain', async () => {
        const mockData = {
            gamesByDate: [
                {
                    date: '2025-02-09',
                    games: [
                        {
                            id: 1,
                            gameState: 'Scheduled',
                            threeMinRecap: 'recapLink',
                            gameDate: '2025-02-09',
                            startTimeUTC: '2025-02-09T18:00:00Z',
                            homeTeam: {
                                name: { default: 'Team A' },
                                abbrev: 'TMA',
                                score: 0,
                                logo: 'logoA',
                            },
                            awayTeam: {
                                name: { default: 'Team B' },
                                abbrev: 'TMB',
                                score: 0,
                                logo: 'logoB',
                            },
                        },
                    ],
                },
            ],
        };

        axios.get.mockResolvedValue({ data: mockData });

        const games = await getGamesLive();
//filtre les jeux pour aujourd'hui, hier et demain
        expect(games).toHaveLength(1); 
        expect(games[0].date).toBe('2025-02-09'); 
        expect(games[0].games).toHaveLength(1); 
    });

    //lancer une erreur si l'appel à l'API échoue
    it('doit lancer une erreur si l\'appel échoue', async () => {
        axios.get.mockRejectedValue(new Error('API Error'));

        try {
            await getGamesLive();
        } catch (error) {
            expect(error.message).toBe('Impossible de récupérer les données des matchs.');
        }
    });
});

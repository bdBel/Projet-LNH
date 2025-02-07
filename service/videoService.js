const { getGamesByDate } = require('./liveScoreService');
const connectDb = require('../config/db');
const Video = require('../models/Video'); // Assurez-vous que le chemin est correct
const API_KEY = 'AIzaSyDJTQHL-YT6LRg3jJoth9juTwV72HMGV3Q';

const getVideoIds = async () => {
    console.log(`[${new Date().toISOString()}] 🚀 getVideoIds() exécuté`);
    const fetch = (await import('node-fetch')).default;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split('T')[0];

    try {
        await connectDb(); // Connectez-vous à la base de données

        await Video.deleteMany({}); // Supprimer toutes les vidéos de la base de données
       

        const games = await getGamesByDate(formattedDate);
        const videoPromises = games.map(async (game) => {
            if (game.homeTeam && game.awayTeam) {
                const homeTeam = game.homeTeam.name.default;
                const awayTeam = game.awayTeam.name.default;
                const searchQuery = `NHL Highlights ${homeTeam} vs ${awayTeam} ${formattedDate}` ;
                const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&key=${API_KEY}`;

                const response = await fetch(youtubeUrl);
                const data = await response.json();
                const NHLID = 'UCqFMzb-4AUf6WAIbl132QKA';

                if (data.items && data.items.length > 0) {
                    const videoData = {
                        channelID : NHLID,
                        channelTitle: data.items[0].snippet.channelTitle,
                        videoId: data.items[0].id.videoId,
                        title: data.items[0].snippet.title,
                        description: data.items[0].snippet.description,
                        thumbnail: data.items[0].snippet.thumbnails.default.url,
                        url: `https://www.youtube.com/embed/${data.items[0].id.videoId}`
                    };
                    if(videoData.channelID === NHLID){
                         // Insérer ou mettre à jour la vidéo dans la base de données
                    await Video.updateOne(
                        { videoId: videoData.videoId },
                        { $set: videoData },
                        { upsert: true }
                    );
                    console.log('Video insérer')

                    }

                    return videoData.url;
                } else {
                    return null;
                }
            } else {
                console.error('Invalid game data structure:', game);
                return null;
            }
        });

        const videos = await Promise.all(videoPromises);
        const validVideos = videos.filter(video => video !== null);

        // Retourner les vidéos sous forme de liens YouTube
        return validVideos;
    } catch (error) {
        console.error('Error fetching video IDs:', error);
        throw error;
    }
};

// Nouvelle fonction pour récupérer les vidéos de la base de données
const getVideosFromDb = async () => {
    try {
        await connectDb(); // Connectez-vous à la base de données
        const videos = await Video.find({}); // Récupérer les vidéos de la base de données

        console.log('Videos from database:', videos);
        return videos;
    } catch (error) {
        console.error('Error fetching videos from database:', error);
        throw error;
    }
};
 //getVideoIds();

module.exports = {
    getVideoIds,
    getVideosFromDb
};
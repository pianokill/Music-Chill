import MusicPlayer from './musicPlayer.js';

// Initialize the music player with the configuration object
const player = new MusicPlayer({
    apiUrl: '/api/songs',
    playButtonSelector: '.play',
    prevButtonSelector: '.prev',
    nextButtonSelector: '.next',
    songInfoSelectors: {
        name: '.song-name',
        artist: '.artist-name',
        image: '.song-img'
    }
});

// Start the music player
player.init();

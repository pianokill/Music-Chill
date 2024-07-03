import MusicPlayer from './musicPlayer.js';

// Initialize the music player with the configuration object
const player = new MusicPlayer({
    apiUrl: '/api/songs',
    buttonSelectors: {
        play: '.play',
        prev: '.prev',
        next: '.next'
    },
    timeSelectors: {
        start: '.time_start',
        end: '.time_end',
        bar: '#progress'
    },
    songInfoSelectors: {
        name: '.song-name',
        artist: '.artist-name',
        image: '.song-img'
    }
});

// Start the music player
player.init();

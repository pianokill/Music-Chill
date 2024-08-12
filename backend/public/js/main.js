import MusicPlayer from './musicPlayer.js';

// Initialize the music player with the configuration object
const player = new MusicPlayer({
    apiUrl: '/api/songs/usersongs',
    buttonSelectors: {
        play: '.play',
        prev: '.prev',
        next: '.next',
        shuff: '.shuffer',
        repeat: '.repeat',
        add: '.add',
        like: '.like'
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
    },
    mainSelectors: {
        search: '.search-box',
        cancel: '.main-nav .cancel',
        home: '.home',
        result: '.search-result',
    },
    queueSelectors: {
        queue: 'ul.queue'
    },
    volumeSelectors: {
        bar: '#vol',
    },
    popupSelectors:{
        popup: '.popup',
        closePopup: '.popup .cancel',
    }
});

// Start the music player
player.init();

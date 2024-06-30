const hostUrlAudio = "https://github.com/fantastichaha11/storage/blob/main/audio/";
const hostUrlImg = "https://github.com/fantastichaha11/storage/blob/main/image/";
let songData;
const audio = new Audio();
let isPlaying = false;
let currentSongIndex = 0;

window.onload = async () => {
    let response = await fetch('/api/songs');
    songData = await response.json();
    const audioUrl = hostUrlAudio + `${songData[0].id}.mp3?raw=true`;
    audio.src = audioUrl;
}

const playButton = document.querySelector('.play');
playButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        document.querySelector('.play i').classList.remove('fa-pause');
        document.querySelector('.play i').classList.add('fa-play');
        isPlaying = false;
    }
    else {
        audio.play();
        document.querySelector('.play i').classList.remove('fa-play');
        document.querySelector('.play i').classList.add('fa-pause');
        isPlaying = true;
    }
});

const prevButton = document.querySelector('.prev');
prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songData.length) % songData.length;
    const audioUrl = hostUrlAudio + `${songData[currentSongIndex].id}.mp3?raw=true`;
    audio.src = audioUrl;
    audio.play();
    isPlaying = true;
    updateSongInfo();
});

const nextButton = document.querySelector('.next');
nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songData.length;
    const audioUrl = hostUrlAudio + `${songData[currentSongIndex].id}.mp3?raw=true`;
    audio.src = audioUrl;
    audio.play();
    isPlaying = true;
    updateSongInfo();
});

function updateSongInfo() {
    const songName = document.querySelector('.song-name');
    const artist = document.querySelector('.artist-name');
    const songImg = document.querySelector('.song-img');

    const imageUrl = hostUrlImg + `${songData[currentSongIndex].id}.jpg?raw=true`;

    songName.textContent = songData[currentSongIndex].name;
    artist.textContent = songData[currentSongIndex].artist;
    songImg.style.backgroundImage = `url(${imageUrl})`;
}
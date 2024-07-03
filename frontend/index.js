const hostUrlAudio = "https://github.com/fantastichaha11/storage/blob/main/audio/";
const hostUrlImg = "https://github.com/fantastichaha11/storage/blob/main/image/";
let songData = [
    {id: 1, name: "Magnetic", artist: "ILLIT", },
    {id: 2, name: "Simp Gái 808", artist: "Low G"},
];
const audio = new Audio();
let isPlaying = false;
let currentSongIndex = 0;

const audioUrl = hostUrlAudio + `${songData[0].id}.mp3?raw=true`;
audio.src = audioUrl;
const songName = document.querySelector('.song-name');
const artist = document.querySelector('.artist-name');
const songImg = document.querySelector('.song-img');
const imageUrl = hostUrlImg + `${songData[currentSongIndex].id}.jpg?raw=true`;
songName.textContent = songData[currentSongIndex].name;
artist.textContent = songData[currentSongIndex].artist;
songImg.style.backgroundImage = `url(${imageUrl})`;

const playButton = document.querySelector('.play');
playButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        togglePlayButton();
        isPlaying = false;
    }
    else {
        audio.play();
        togglePlayButton();
        isPlaying = true;
    }
});

const prevButton = document.querySelector('.prev');
prevButton.addEventListener('click', () => {
    if (!isPlaying) togglePlayButton();

    currentSongIndex = (currentSongIndex - 1 + songData.length) % songData.length;
    const audioUrl = hostUrlAudio + `${songData[currentSongIndex].id}.mp3?raw=true`;
    audio.src = audioUrl;
    audio.play();
    isPlaying = true;
    updateSongInfo();
});

const nextButton = document.querySelector('.next');
nextButton.addEventListener('click', () => {
    if (!isPlaying) togglePlayButton();

    currentSongIndex = (currentSongIndex + 1) % songData.length;
    const audioUrl = hostUrlAudio + `${songData[currentSongIndex].id}.mp3?raw=true`;
    audio.src = audioUrl;
    audio.play();
    isPlaying = true;
    updateSongInfo();
});

function updateSongInfo() {
    

    const imageUrl = hostUrlImg + `${songData[currentSongIndex].id}.jpg?raw=true`;

    songName.textContent = songData[currentSongIndex].name;
    artist.textContent = songData[currentSongIndex].artist;
    songImg.style.backgroundImage = `url(${imageUrl})`;
}

function togglePlayButton() {
    document.querySelector('.play i').classList.toggle('fa-play');
    document.querySelector('.play i').classList.toggle('fa-pause');
}
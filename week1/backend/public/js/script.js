const hostUrlAudio = "https://github.com/fantastichaha11/storage/blob/main/audio/";
const hostUrlImg = "https://github.com/fantastichaha11/storage/blob/main/image/";
const timeStart = document.querySelector('.time_start');
const timeEnd = document.querySelector('.time_end');
const timeBar = document.querySelector('#progress');
let songData;
const audio = new Audio();
let isPlaying = false;
let currentSongIndex = 0;
let timer = setInterval(displayTimer, 500);


window.onload = async () => {
    let response = await fetch('/api/songs');
    songData = await response.json();
    const audioUrl = hostUrlAudio + `${songData[0].id}.mp3?raw=true`;
    audio.src = audioUrl;
}

audio.addEventListener('ended', nextSong);
function nextSong(){
    currentSongIndex = (currentSongIndex + 1) % songData.length;
    const audioUrl = hostUrlAudio + `${songData[currentSongIndex].id}.mp3?raw=true`;
    audio.src = audioUrl;
    audio.play();
    isPlaying = true;
    updateSongInfo();
}
const playButton = document.querySelector('.play');
playButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        document.querySelector('.play i').classList.remove('fa-pause');
        document.querySelector('.play i').classList.add('fa-play');
        isPlaying = false;
        clearInterval(timer);
    }
    else {
        audio.play();
        document.querySelector('.play i').classList.remove('fa-play');
        document.querySelector('.play i').classList.add('fa-pause');
        isPlaying = true;
        timeStart = setInterval(displayTimer, 500);
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

function convertTimer(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds - min * 60);
  
    const paddedMinutes = String(min).padStart(2, '0');
    const paddedSeconds = String(sec).padStart(2, '0');
  
    const formattedTime = `${paddedMinutes}:${paddedSeconds}`;
    return formattedTime;
  }

function displayTimer(){
    const {duration, currentTime} = audio;
    timeBar.max = duration;
    timeBar.value = currentTime;
    timeStart.textContent = convertTimer(currentTime);
    if (!audio.duration){
        timeEnd.textContent = "00:00";
    } 
    else 
    {
        timeEnd.textContent = convertTimer(duration);
    }
}

timeBar.addEventListener("change", runTimeBar);
function runTimeBar(){
    const temp = timeBar.value;
    clearInterval(timer);
    audio.currentTime = Math.floor(temp);
    timer = setInterval(displayTimer, 500);
}
const HOST_URL_AUDIO = "https://github.com/fantastichaha11/storage/blob/main/audio/";
const HOST_URL_IMG = "https://github.com/fantastichaha11/storage/blob/main/image/";


export default class MusicPlayer {
    #audio;
    #songData = [];
    #timerInterval;

    constructor(config) {
        this.apiUrl = config.apiUrl;

        this.playButton = document.querySelector(config.buttonSelectors.play);
        this.prevButton = document.querySelector(config.buttonSelectors.prev);
        this.nextButton = document.querySelector(config.buttonSelectors.next);
        this.shuffButton = document.querySelector(config.buttonSelectors.shuff);

        this.songNameElement = document.querySelector(config.songInfoSelectors.name);
        this.artistElement = document.querySelector(config.songInfoSelectors.artist);
        this.songImgElement = document.querySelector(config.songInfoSelectors.image);

        this.timeStart = document.querySelector(config.timeSelectors.start);
        this.timeEnd = document.querySelector(config.timeSelectors.end);
        this.timeBar = document.querySelector(config.timeSelectors.bar);

        this.#audio = new Audio();
        this.isPlaying = false;
        this.shuffer = false;   
        this.currentSongIndex = 0;
        

        // Initialize Event Listeners
        this.playButton.addEventListener('click', () => this.togglePlayPause());
        this.prevButton.addEventListener('click', () => this.navigateSong(-1));
        this.nextButton.addEventListener('click', () => this.navigateSong(1));
        this.shuffButton.addEventListener('click',() => this.shufferMusic());
        this.#audio.addEventListener('ended', () => this.navigateSong(1));
        this.timeBar.addEventListener('change', () => this.changeTimeBar());
    }

    // Initialize the music player
    async init() {
        try {
            this.#songData = await this.fetchSongData();
            if (this.#songData.length > 0) {
                this.loadSong(this.currentSongIndex);
            }
        } catch (error) {
            console.error("Failed to fetch songs:", error);
        }
    }

    // Fetch song data from the API
    async fetchSongData() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching song data:', error);
            throw error;
        }
    }

    // Load and play the song by index
    loadSong(index) {
        const song = this.#songData[index];
        const audioUrl = `${HOST_URL_AUDIO}${song.id}.mp3?raw=true`;
        this.#audio.src = audioUrl;
        this.updateSongInfo(song);
        this.#audio.addEventListener('loadedmetadata', () => {
            this.displayTimer();
        });
    }

    // Update the displayed song information
    updateSongInfo(song) {
        const imageUrl = `${HOST_URL_IMG}${song.id}.jpg?raw=true`;
        this.songNameElement.textContent = song.name;
        this.artistElement.textContent = song.artist;
        this.songImgElement.style.backgroundImage = `url(${imageUrl})`;
    }

    // Toggle play and pause state
    togglePlayPause() {
        if (this.isPlaying) {
            this.pauseAudio();
            clearInterval(this.#timerInterval);
            this.#timerInterval = null;
        } else {
            this.playAudio();
            if (!this.#timerInterval) {
                this.#timerInterval = setInterval(() => this.displayTimer(), 1000);
            }
        }
        this.togglePlayButtonIcon();
    }

    // Play the audio
    playAudio() {
        this.#audio.play();
        this.isPlaying = true;
    }

    // Pause the audio
    pauseAudio() {
        this.#audio.pause();
        this.isPlaying = false;
    }

    // Update the play button icon
    togglePlayButtonIcon() {
        this.playButton.querySelector('i').classList.toggle('fa-play');
        this.playButton.querySelector('i').classList.toggle('fa-pause');
    }

    //shuffer

    shufferMusic(){
        console.log(this.shuffButton);
        if (this.shuffer){ 
            this.shuffer = false;
            this.shuffButton.style.color = 'black';
        }
        else {
            this.shuffer = true;
            this.shuffButton.style.color = '#39aae2';
        }
    }
    // Navigate to the previous or next song
    navigateSong(direction) {
        if (!this.isPlaying) this.togglePlayButtonIcon();
        if (this.shuffer){
            this.currentSongIndex = Math.floor(Math.random() * this.#songData.length) % this.#songData.length;
        }
        else
        {
            this.currentSongIndex = (this.currentSongIndex + direction + this.#songData.length) % this.#songData.length;
        }
        this.loadSong(this.currentSongIndex);
        this.playAudio();
        if (!this.#timerInterval) {
            this.#timerInterval = setInterval(() => this.displayTimer(), 1000);
        }
    }

    // Convert time in seconds to minutes and seconds
    convertTimer(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds - min * 60);
      
        const paddedMinutes = String(min).padStart(2, '0');
        const paddedSeconds = String(sec).padStart(2, '0');
      
        const formattedTime = `${paddedMinutes}:${paddedSeconds}`;
        return formattedTime;
      }

    // Display the timer
    displayTimer() {
        console.log("displayTimer");
        const {duration, currentTime} = this.#audio;
        this.timeBar.max = duration;
        this.timeBar.value = currentTime;
        this.timeStart.textContent = this.convertTimer(currentTime);
        if (!duration) {
            this.timeEnd.textContent = "00:00";
        } 
        else {
            this.timeEnd.textContent = this.convertTimer(duration);
        }
    }

    // Change the time bar
    changeTimeBar() {
        const temp = this.timeBar.value;
        this.#audio.currentTime = Math.floor(temp);
        this.displayTimer();
    }
}

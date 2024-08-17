const HOST_URL_AUDIO = "https://github.com/fantastichaha11/storage/blob/main/audio/";
const HOST_URL_IMG = "https://github.com/fantastichaha11/storage/blob/main/image/";


export default class MusicPlayer {
    #audio;
    #songData = [];
    #likedSongs = [];
    #timeInSeconds = 0;
    #timerInterval;
    #secondsInterval;

    constructor(config) {
        this.apiUrl = config.apiUrl;

        this.playButton = document.querySelector(config.buttonSelectors.play);
        this.prevButton = document.querySelector(config.buttonSelectors.prev);
        this.nextButton = document.querySelector(config.buttonSelectors.next);
        this.shuffButton = document.querySelector(config.buttonSelectors.shuff);
        this.likeButton = document.querySelector(config.buttonSelectors.like);
        this.addButton = document.querySelector(config.buttonSelectors.add);

        this.songNameElement = document.querySelector(config.songInfoSelectors.name);
        this.artistElement = document.querySelector(config.songInfoSelectors.artist);
        this.songImgElement = document.querySelector(config.songInfoSelectors.image);

        this.timeStart = document.querySelector(config.timeSelectors.start);
        this.timeEnd = document.querySelector(config.timeSelectors.end);
        this.timeBar = document.querySelector(config.timeSelectors.bar);

        this.searchBox = document.querySelector(config.mainSelectors.search);
        this.cancelButton = document.querySelector(config.mainSelectors.cancel);
        this.home = document.querySelector(config.mainSelectors.home);
        this.result = document.querySelector(config.mainSelectors.result);

        this.volBar = document.querySelector(config.volumeSelectors.bar);
        this.queue = document.querySelector(config.queueSelectors.queue);

        this.popup = document.querySelector(config.popupSelectors.popup);
        this.closePopup = document.querySelector(config.popupSelectors.closePopup);

        this.#audio = new Audio();
        this.isPlaying = false;
        this.shuffer = false;   
        this.currentSongIndex = 0;
        

        // Initialize Event Listeners
        this.likeButton.addEventListener('click', () => this.toggleLike());
        this.playButton.addEventListener('click', () => this.togglePlayPause());
        this.prevButton.addEventListener('click', () => this.navigateSong(-1));
        this.nextButton.addEventListener('click', () => this.navigateSong(1));
        this.shuffButton.addEventListener('click',() => this.shufferMusic());
        this.#audio.addEventListener('ended', () => this.navigateSong(1));
        this.timeBar.addEventListener('change', () => this.changeTimeBar());


        this.searchBox.addEventListener('focus', () => this.inSearch());
        this.cancelButton.addEventListener('click', () => this.outSearch());
        this.searchBox.addEventListener('keyup', (e) => this.updateSearch(e));
        this.volBar.addEventListener('input', () => this.changeVolBar());
        this.queue.addEventListener('click', (e) => this.changeSong(e));
        this.result.addEventListener('click', (e) => this.changeSong(e));

        this.addButton.addEventListener('click', () => this.togglePopup());
        this.closePopup.addEventListener('click', () => this.togglePopup());
    }

    // Initialize the music player
    async init() {
        try {
            this.#songData = await this.fetchSongData();
            const data = await this.fetchLikedSongs();
            this.#likedSongs = data.map(song => song.id);
            if (this.#songData.length > 0) {
                this.loadSong(this.currentSongIndex);
            }
            await this.fetchMiddleSectionSongs(); // Fetch for the middle section

        } catch (error) {
            console.error("Failed to fetch songs:", error);
        }
    }

    // Fetch liked songs from the API
    async fetchLikedSongs() {
        const likedSongsApiUrl = '/api/history/likedSongs';
        try {
            const response = await fetch(likedSongsApiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching liked songs:', error);
            throw error;
        }
    }

    async fetchMiddleSectionSongs() {
        const middleApiUrl = '/api/songs/recommendations'; // Replace with your new API endpoint
        try {
            const response = await fetch(middleApiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const middleSongs = await response.json();
            this.displayMiddleSectionSongs(middleSongs);
        } catch (error) {
            console.error('Error fetching middle section songs:', error);
            throw error;
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
    
    // Add this method to display the fetched songs in the middle section
    displayMiddleSectionSongs(middleSongs) {
        const middleSectionElement = document.querySelector('.home .music-list');
        middleSectionElement.innerHTML = ''; // Clear existing content
    
        middleSongs.forEach(song => {
            const imgUrl = `${HOST_URL_IMG}${song.id}.jpg?raw=true`;
            const songElement = document.createElement('li');
            songElement.classList.add('music-items');
            songElement.innerHTML = `
                <div class="item-img" style="background-image: url(${imgUrl})"></div>
                <div class="item-info">
                    <div class="item-name">${song.name}</div>
                    <div class="item-artist">${song.artist}</div>
                </div>`;
            middleSectionElement.appendChild(songElement);
        });
    }

    // Load and play the song by index
    loadSong(index) {
        const song = this.#songData[index];
        const audioUrl = `${HOST_URL_AUDIO}${song.id}.mp3?raw=true`;
        this.#audio.src = audioUrl;
        this.updateSongInfo(song);
        this.displayQueueSongs(index);
        this.#audio.addEventListener('loadedmetadata', () => {
            this.displayTimer();
        });
        if (this.#likedSongs.includes(song.id) && this.likeButton.classList.contains('btn-off')) {
            console.log("a");
            this.toggleOnOffButton(this.likeButton);
        }
        if (!(this.#likedSongs.includes(song.id)) && this.likeButton.classList.contains('btn-on')) {
            console.log("b");
            this.toggleOnOffButton(this.likeButton);
        }
    }
    // Update the listening times to the server
    updateListeningTimesToServer(songId, times) {
        const listeningTimesApiUrl = `/api/history/listeningTimes/${songId}`;
        fetch(listeningTimesApiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ times })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
    }

    // Update liked song to the server
    updateLikedSongToServer(songId, liked) {
        const likeSongApiUrl = `/api/history/likeSong/${songId}`;
        fetch(likeSongApiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ liked })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
    }

    // Update the displayed song information
    updateSongInfo(song) {
        const imageUrl = `${HOST_URL_IMG}${song.id}.jpg?raw=true`;
        this.songNameElement.textContent = song.name;
        this.artistElement.textContent = song.artist;
        this.songImgElement.style.backgroundImage = `url(${imageUrl})`;
    }

    displayQueueSongs(currentIndex){
        let queueElement = document.querySelector('ul.queue');
        queueElement.innerHTML = '';
        for (var i = currentIndex + 1;i < this.#songData.length;i++){
            let imgUrl = `${HOST_URL_IMG}${this.#songData[i].id}.jpg?raw=true`;
            let songQueueElement = document.createElement('li');
            songQueueElement.classList.add('music-items');
            songQueueElement.innerHTML = 
            `<div class="item-img" style="background-image: url(${imgUrl})"></div>
            <div class="item-info">
                <div class="item-name">${this.#songData[i].name}</div>
                <div class="item-owner">${this.#songData[i].artist}</div>
            </div>`;
            queueElement.appendChild(songQueueElement);
        }
        for (var i = 0;i < currentIndex;i++){
            let imgUrl = `${HOST_URL_IMG}${this.#songData[i].id}.jpg?raw=true`;
            console.log(imgUrl);
            let songQueueElement = document.createElement('li');
            songQueueElement.classList.add('music-items');
            songQueueElement.innerHTML = 
            `<div class="item-img" style="background-image: url(${imgUrl})"></div>
            <div class="item-info">
                <div class="item-name">${this.#songData[i].name}</div>
                <div class="item-owner">${this.#songData[i].artist}</div>
            </div>`;
            queueElement.appendChild(songQueueElement);
        }
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
        this.secondsCounterStart();
    }

    // Pause the audio
    pauseAudio() {
        this.#audio.pause();
        this.isPlaying = false;
        this.secondsCounterStop();
    }

    // Update the play button icon
    togglePlayButtonIcon() {
        this.playButton.querySelector('i').classList.toggle('fa-play');
        this.playButton.querySelector('i').classList.toggle('fa-pause');
    }

    //shuffer

    toggleOnOffButton(button){
        button.classList.toggle('btn-on');
        button.classList.toggle('btn-off');
    }

    shufferMusic(){
        this.toggleOnOffButton(this.shuffButton);
        if (this.shuffer){ 
            this.shuffer = false;
        }
        else {
            this.shuffer = true;
        }
    }
    // Navigate to the previous or next song
    navigateSong(direction) {
        // Update the listening times to the server
        this.secondsCounterStop();
        this.updateListeningTimesToServer(this.#songData[this.currentSongIndex].id, this.#timeInSeconds);
        this.#timeInSeconds = 0;

        // Update the liked song to the server
        if (this.likeButton.classList.contains('btn-on') && !(this.#likedSongs.includes(this.#songData[this.currentSongIndex].id))) {
            this.updateLikedSongToServer(this.#songData[this.currentSongIndex].id, true);
            this.#likedSongs.push(this.#songData[this.currentSongIndex].id);
        }
        if (this.likeButton.classList.contains('btn-off') && this.#likedSongs.includes(this.#songData[this.currentSongIndex].id)) {
            this.updateLikedSongToServer(this.#songData[this.currentSongIndex].id, false);
            this.#likedSongs.splice(this.#likedSongs.indexOf(this.#songData[this.currentSongIndex].id), 1);
        }

        // toggle play button
        if (!this.isPlaying) this.togglePlayButtonIcon();
        // Navigate to the next song
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

    // Toggle the like button
    toggleLike() {
        this.toggleOnOffButton(this.likeButton);
    }

    // Seconds counter
    secondsCounterStart() {
        this.#secondsInterval = setInterval(() => {
            this.#timeInSeconds++;
            console.log(this.#timeInSeconds);
        }, 1000);
    }

    secondsCounterStop() {
        clearInterval(this.#secondsInterval);
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

    // Change the volume bar
    changeVolBar(){
        const temp = this.volBar.value;
        this.#audio.volume = temp /100;
    }

    inSearch(){
        this.home.classList.add('hide');
        this.result.classList.remove('hide');
        this.cancelButton.classList.remove('hide');
    }

    outSearch(){
        this.home.classList.remove('hide');
        this.result.classList.add('hide');
        this.cancelButton.classList.add('hide');
        this.searchBox.value = '';
    }

    updateSearch(e){
        let searchData = e.target.value.toLowerCase();
        this.result.innerHTML = '';
        if (searchData.length > 0){
            const filterData = this.#songData.filter((song) => song.name.toLowerCase().includes(searchData));
            for (var i = 0;i < filterData.length;i++){
                let imgUrl = `${HOST_URL_IMG}${filterData[i].id}.jpg?raw=true`;
                console.log(imgUrl);
                let resultElement = document.createElement('li');
                resultElement.classList.add('music-items');
                resultElement.innerHTML = 
                `<div class="item-img" style="background-image: url(${imgUrl})"></div>
                <div class="item-info">
                    <div class="item-name">${filterData[i].name}</div>
                    <div class="item-owner">${filterData[i].artist}</div>
                </div>`;
                this.result.appendChild(resultElement);
            }
        }
    }
    
    changeSong(e){
        let temp = e.target;
        let song = temp.closest('li');
        let name = song.querySelector('.item-name').innerHTML;
        let artist = song.querySelector('.item-owner').innerHTML;
        let i = this.#songData.findIndex(s => {return s.name === name && s.artist === artist});
        this.navigateSong(i - this.currentSongIndex);
    }

    togglePopup(){
        this.popup.classList.toggle('hide');
    }
}

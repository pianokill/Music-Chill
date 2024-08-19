songData = []

async function fetchSongData(){
    try {
        const response = await fetch('/profile/api');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching song data:', error);
        throw error;
    }
}

fetchSongData().then(data => {
    songData = data
    displaySongs()
    console.log(data)
}).catch(error => {
    console.error('Failed to fetch song data:', error);
});

let currentIndex;

function displaySongs() {
    const songList = document.getElementById('songList');
    songList.innerHTML = ''; 
    songData.forEach((song, index) => {
        if (song.name.length > 0) {
        const li = document.createElement('li');
        li.className = 'song-item';
        li.innerHTML = `
            <span class="song-name">${song.name}</span>
            <button class="updateBtn" onclick="showUpdateOverlay(${index})">Update</button>
            <button class="deleteBtn" onclick="deleteSong(${index})">Delete</button>
        `;
        songList.appendChild(li);
        }
    });
    songList.innerHTML += '<div class= "containerBtn"><button class="changeBtn" onclick="changeBtn()">Apply</button></div>'
}


function showUpdateOverlay(index) {
    currentIndex = index;
    const overlay = document.getElementById('overlay');
    const newSongNameInput = document.getElementById('newSongName');
    newSongNameInput.value = songData[index].name; 
    overlay.style.display = 'block';
}


function saveSongName() {
    const newSongName = document.getElementById('newSongName').value.trim();
    
    if (newSongName !== '') {
        songData[currentIndex].name = newSongName;
        displaySongs();
        closeOverlay();
    }
}

// Xóa bài hát 
function deleteSong(index) {
    songData.splice(index,1)
    displaySongs();
}

// Đóng overlay
function closeOverlay() {   
    document.getElementById('overlay').style.display = 'none';
}


// Gắn sự kiện
document.getElementById('saveSongNameBtn').addEventListener('click', saveSongName);
document.getElementById('closeOverlay').addEventListener('click', closeOverlay);

//Gửi data về server
async function changeBtn(){
    try {
        const response = await fetch('/profile/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(songData) 
        });
        if (!response.ok) {
            throw new Error('Network response was not ok!');
        }

        const result = await response.json();
        if (!result.error) alert(result.message);
        else alert("Something wrong!!!")
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error updating the songs.');
    }
}

function menuFunction(x) 
    {
      x.classList.toggle("change");
      var dropdown = document.querySelector(".dropdown-content");
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }

    window.onclick = function(event) 
    {
      if (!event.target.matches('.menubtn, .menubtn *')) {
        var dropdown = document.querySelector(".dropdown-content");
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        }
        var bars = document.querySelector('.menubtn');
        if (bars.classList.contains('change')) {
            bars.classList.remove('change');
        }
      }
    }

// read in4
function checkArtist() {
    const value = `${document.cookie}`;
    const decodedCookie = decodeURIComponent(value);
    const jsonString = decodedCookie.split('=')[1]
    const user = JSON.parse(jsonString)
    if (user.check == false){
      document.querySelector(".profile-info h1").textContent = user.name
      document.querySelector(".profile-info p").textContent = user.mail
    } else{
      document.querySelector(".profile-info h1").textContent = user.name
      document.querySelector(".profile-info p").textContent = user.mail
    }
}
checkArtist()


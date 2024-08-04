// Function to check song name length
        

function checkSongNameLength() {
    const maxLength = 100;
    let input = document.getElementById("songName").value;
    let submit = document.getElementById("submit");
    let remaining = maxLength - input.length;
    let charCount = document.getElementById("charCount");
    charCount.textContent = `${remaining} characters left`;

    if (remaining < 0) {
        charCount.style.color = "red";
        submit.disabled = true;
    } else {
        charCount.style.color = "initial";
        submit.disabled = false;
    }
}
function checkReleaseDate() {
    let submit = document.getElementById("submit");
    let releaseDate = document.getElementById("releaseDate").value;
    let today = new Date();
    let selectedDate = new Date(releaseDate);

    let dateValidation = document.getElementById("dateValidation");

    if (selectedDate > today) {
        submit.disabled = true;
        dateValidation.textContent = "Release date cannot be in the future.";
        dateValidation.style.color = "red";
    }
    else {
        submit.disabled = false;
        dateValidation.textContent = "";
    }
}

// Process form submit
document.getElementById("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    let msg = document.getElementById("message"),
        form = document.getElementById("form"),
        submit = document.getElementById("submit");

    submit.disabled = true;
    msg.innerHTML = "Uploading...";
    
    let data = new FormData(form);

    try {
        let res = await fetch("/upload", {
            method: "POST",
            body: data,
        });
        // receive json response
        let json = await res.json();
        msg.innerHTML = json.message;
    } catch (error) {
        console.error('Error uploading: ', error);
        msg.innerHTML = "Error uploading the song.";
    } finally {
        // refresh form
        form.reset();
        submit.disabled = false;
    }

    return false;
});
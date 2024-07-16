const pianoKeys = document.querySelectorAll(".piano-keys .key");

let allKeys = [],
    pressedKeys = new Set(); // Set to keep track of pressed keys

let pianoEnabled = false; // Flag to track if piano keys should be enabled

const playTune = (key) => {
    if (!pianoEnabled) return; // Check if piano is enabled
    const audio = new Audio(`LooneyNotes/${key}.wav`); // create a new Audio object for each key press
    audio.play(); // play audio

    const clickedKey = document.querySelector(`[data-key="${key}"]`); // get the clicked key element
    clickedKey.classList.add("active"); // add active class to the clicked key element
    setTimeout(() => { // remove active class after 150 ms from the clicked key element
        clickedKey.classList.remove("active");
    }, 150);
}

pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key); // add data-key value to the allKeys array
    // Add event listener to check if piano is enabled before playing
    key.addEventListener("click", () => {
        if (pianoEnabled) playTune(key.dataset.key);
    });
});

const pressedKey = (e) => {
    if (!pianoEnabled) return; // Check if piano is enabled
    const key = e.key.toLowerCase();
    if (allKeys.includes(key) && !pressedKeys.has(key)) {
        playTune(key);
        pressedKeys.add(key);
    }
}

const releasedKey = (e) => {
    if (!pianoEnabled) return; // Check if piano is enabled
    const key = e.key.toLowerCase();
    if (pressedKeys.has(key)) {
        pressedKeys.delete(key);
    }
}

document.addEventListener("keydown", pressedKey);
document.addEventListener("keyup", releasedKey);

// Function to enable piano keys
function enablePiano() {
    pianoEnabled = true;
}

// Function to disable piano keys
function disablePiano() {
    pianoEnabled = false;
}


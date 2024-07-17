const pianoKeys = document.querySelectorAll(".piano-keys .key");

let allKeys = [],
    pressedKeys = new Set(); // Set to keep track of pressed keys

let pianoEnabled = false; // Flag to track if piano keys should be enabled
let sequenceIsPlaying = false;

const playTune = (key) => {
    if (!pianoEnabled || sequenceIsPlaying) return; // Check if piano is enabled
    const audio = new Audio(`LooneyNotes/${key}.wav`); // create a new Audio object for each key press
    audio.play(); // play audio

    const clickedKey = document.querySelector(`[data-key="${key}"]`); // get the clicked key element
    clickedKey.classList.add("active"); // add active class to the clicked key element
    setTimeout(() => { // remove active class after 150 ms from the clicked key element
        clickedKey.classList.remove("active");
    }, 150);
}

const playSequence = (key) => {
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

// Define sound sequences for each level manually
const levels = {
    0: [['a', 'a', 'a']],
    1: [['s', 's', 's'], ['d', 'd', 'd'], ['f', 'f', 'f']],
    2: [['t', 'y', 'e', 'f'], ['f', 'g', 'a', 'j'], ['l', 'o', 'o']],
    3: [['d', 'e', 'f', 'g'], ['f', 'g', 'a', 'j'], ['e', 'f', 'g', 'h']],
    4: [['g', 'a', 'a', 's', 'd'], ['e', 'f', 'g', 'a', ';'], ['w', 'd', 'e', 'f', 'g']],
    5: [['a', 's', 'd', 'f'], ['g', 'h', 'j', 'k'], ['l', ';', 'a', 's']],
    6: [['w', 'e', 't', 'y'], ['u', 'o', 'p', ';'], ['a', 's', 'd', 'f']],
    7: [['a', 'd', 'f', 'g'], ['h', 'j', 'k', 'l'], ['s', 'd', 'f', 'g']],
    8: [['e', 'o', 't', 'y'], ['u', ';', 'o', 'p'], ['a', 's', 'd', 'f']],
    9: [['w', 'e', 't', 'y', 'u'], [';', 'o', 'p', ';', 'a'], ['s', 'd', 'f', 'g', 'h']],
    10: [['a', 'w', 'f', 'd', 'e'], ['f', 'g', 'a', 'a', 'k'], ['d', 'e', 'f', 'g', 'h']],
    11: [['t', 'y', 'u', 'g', 'o'], ['p', ';', 'a', 's', 'd'], ['f', 'g', 'h', 'j', 'k']],
    12: [['l', 'k', 'j', 'h', 'g'], ['f', 'd', 's', 'a', 'p'], ['o', 'h', 'u', 'y', 't']],
    13: [['e', 'w', 'w', 'a', 's'], ['d', 'f', 'g', 'h', 'j'], ['k', 'l', ';', 'a', 's']],
    14: [['p', 'w', 't', 'u', 'y'], ['t', 'w', 'e', 'w', 'u'], ['a', 's', 'd', 'f', 'g']],
    15: [['h', 'j', 'k', 'l', ';'], ['a', 's', 'd', 'f', 'g'], ['h', 'j', 'a', 'l', 'e']]
};

// Function to play sounds in sequence for a given level
function playLevelSounds(level) {
    const sequences = levels[level];
    if (!sequences) return;

    // Pick a random sequence from the level
    const sequence = sequences[Math.floor(Math.random() * sequences.length)];
    let index = 0;

    sequenceIsPlaying = true;

    const playNext = () => {
        if (index < sequence.length) {
            playSequence(sequence[index]);
            index++;
            setTimeout(playNext, 500); // Wait 500ms before playing the next sound
        } else {
            // Enable the play button again after the sequence is played
            playButton.disabled = false;
            sequenceIsPlaying = false;
            // After playing the sequence, move to the next level
            currentLevel++;
            if (currentLevel > 15) {
                alert("Congratulations! You've completed all levels.");
            } else {
                updateLevelDisplay();
            }
        }
    }

    playNext();
}

// Function to update the level display
function updateLevelDisplay() {
    document.querySelector('.level').innerHTML = `Level:<br>${currentLevel}`;
}

// Example usage
let currentLevel = 0;
updateLevelDisplay(); // Initialize the level display

const playButton = document.querySelector('.play-button');
playButton.addEventListener('click', () => {
    if (currentLevel <= 15) {
        playButton.disabled = true; // Disable the play button while the sequence is playing
        playLevelSounds(currentLevel);
    }
});

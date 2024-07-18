const pianoKeys = document.querySelectorAll(".piano-keys .key");
const playButton = document.querySelector('.play-button');
const recordButton = document.querySelector('.record-button');

let allKeys = [];
let pressedKeys = new Set();
let pianoEnabled = false;
let chordIsPlaying = false;
let recording = false;
let currentLevel = 0;

const chords = {
    0: 'ad.wav',
    1: 'ag.wav',
    2: 'ak.wav',
    // Add all other level chords here...
    18: 'sh.wav'
};

const playTune = (key) => {
    if (!pianoEnabled || chordIsPlaying) return;
    const audio = new Audio(`audio/PianoNotes/${key}.wav`);
    audio.play();

    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    clickedKey.classList.add("active");
    setTimeout(() => {
        clickedKey.classList.remove("active");
    }, 150);
};

const playLevelSounds = (level) => {
    chordIsPlaying = true;
    const audio = new Audio(`audio/Chords/${chords[level]}`);
    audio.play();

    audio.onended = () => {
        chordIsPlaying = false;
        playButton.disabled = false;
        recordButton.disabled = false;
    };

    playButton.disabled = true;
};

const pressedKey = (e) => {
    if (!pianoEnabled) return;
    const key = e.key.toLowerCase();
    if (allKeys.includes(key) && !pressedKeys.has(key)) {
        playTune(key);
        pressedKeys.add(key);
        if (recording) {
            verifyUserInput(key);
        }
    }
};

const releasedKey = (e) => {
    if (!pianoEnabled) return;
    const key = e.key.toLowerCase();
    if (pressedKeys.has(key)) {
        pressedKeys.delete(key);
    }
};

const enablePiano = () => {
    pianoEnabled = true;
};

const disablePiano = () => {
    pianoEnabled = false;
};

const updateLevelDisplay = () => {
    const levelDisplay = document.querySelector('.level');
    const difficultyDisplay = document.querySelector('.difficulty');

    let difficulty;
    if (currentLevel === 0) {
        difficulty = "Tutorial";
    } else if (currentLevel >= 1 && currentLevel <= 3) {
        difficulty = "Very Easy";
    } else if (currentLevel >= 4 && currentLevel <= 6) {
        difficulty = "Easy";
    } else if (currentLevel >= 7 && currentLevel <= 9) {
        difficulty = "Medium";
    } else if (currentLevel >= 10 && currentLevel <= 12) {
        difficulty = "Hard";
    } else if (currentLevel >= 13 && currentLevel <= 15) {
        difficulty = "Very Hard";
    } else if (currentLevel >= 16 && currentLevel <= 18) {
        difficulty = "Impossible";
    } else if (currentLevel > 18) {
        difficulty = "Perfect Pitch?";
    }

    levelDisplay.innerHTML = `Level:<br>${currentLevel}`;
    difficultyDisplay.innerHTML = `Difficulty:<br>${difficulty}`;
};

const verifyUserInput = (key) => {
    const chordKeys = chords[currentLevel].replace('.wav', '').split('');
    const keyElement = document.querySelector(`[data-key="${key}"]`);

    if (chordKeys.includes(key)) {
        keyElement.classList.add("correct");
        keyElement.classList.remove("incorrect");
    } else {
        keyElement.classList.add("incorrect");
        keyElement.classList.remove("correct");
    }

    // Check if all chord keys are guessed
    const allCorrect = chordKeys.every(chordKey => {
        return document.querySelector(`[data-key="${chordKey}"]`).classList.contains("correct");
    });

    if (allCorrect) {
        // Disable recording and reset state
        recording = false;
        playButton.disabled = false;
        recordButton.disabled = true;
        // Move to the next level or any other logic
        currentLevel++;
        updateLevelDisplay();
        resetKeyColors();
    }
};

const resetKeyColors = () => {
    pianoKeys.forEach(key => {
        key.classList.remove("correct", "incorrect");
    });
};

pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key);
    key.addEventListener("click", () => {
        if (pianoEnabled) playTune(key.dataset.key);
    });
});

document.addEventListener("keydown", pressedKey);
document.addEventListener("keyup", releasedKey);

playButton.addEventListener('click', () => {
    playButton.disabled = true;
    recordButton.disabled = true;
    playLevelSounds(currentLevel);
});

recordButton.addEventListener('click', () => {
    recordButton.disabled = true;
    recording = true;
});

// Initialize the level and difficulty display
updateLevelDisplay();

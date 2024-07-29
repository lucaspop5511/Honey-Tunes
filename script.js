const pianoKeys = document.querySelectorAll(".piano-keys .key");
const playButton = document.querySelector('.play-button');
const recordButton = document.querySelector('.record-button');

let allKeys = [];
let pressedKeys = new Set();
let pianoEnabled = false;
let chordIsPlaying = false;
let recording = false;
let currentLevel = 0;
let currentChord = '';
let startingNote = '';
let activeAudio = {};
let lives = 3;
let score = 0;

const chords = {
    0: ['a.wav'], // Tutorial
    1: ['ad.wav', 'ag.wav', 'ak.wav'], // Very Easy
    2: ['dj.wav', 'sh.wav', 'd;.wav'],
    3: ['fh.wav', 'gj.wav', 'h;.wav'],
    4: ['af.wav', 'ah.wav', 'as.wav', 'al.wav', 'ae.wav', 'au.wav', 'aj.wav', 'a;.wav'], // Easy
    5: ['sf.wav', 'dy.wav', 'fl.wav', 'tu.wav', 'st.wav', 'hl.wav', 'jl.wav', 'dg.wav'],
    6: ['at.wav', 'ay.wav', 'du.wav', 'hp.wav', 'sy.wav', 'go.wav', 'fj.wav'],
    7: ['adg.wav', 'agk.wav', 'afk.wav', 'adk.wav'], // Medium
    8: ['afh.wav', 'afg.wav', 'adh.wav', 'agj.wav', 'aeg.wav', 'ag;.wav'],
    9: ['sgj.wav', 'agu.wav', 'afy.wav', 'dyj.wav', 'sfh.wav', 'dgj.wav', 'fyk.wav', 'dhk.wav'],
    10: ['aet.wav', 'agp.wav', 'ath.wav', 'af;.wav'], // Hard
    11: ['awf.wav', 'afu.wav', 'atl.wav', 'aeu.wav', 'aey.wav', 'ayp.wav', 'at;.wav'],
    12: ['stu.wav', 'sfy.wav', 'dgu.wav', 'dul.wav', 'tjo.wav', 'etk.wav', 'wfj.wav', 'ghp.wav'],
    13: ['adgj.wav', 'adgu.wav', 'asdg.wav', 'aegl.wav', 'afg;.wav', 'afh;.wav'], // Very Hard
    14: ['aeth.wav', 'sfyj.wav', 'dgou.wav', 'ethk.wav', 'wdgj.wav', 'dgul.wav'],
    15: ['awfk.wav', 'sdto.wav', 'wfgu.wav', 'dtjp.wav', 'dyho.wav', 'wtgj.wav'],
    16: ['afup.wav', 'wtj;.wav', 'fhj;.wav'], // Impossible
    17: ['dgyk.wav', 'egjl.wav', 'dtuk.wav', 'atup.wav', 'awfp.wav'],
    18: ['atg;.wav', 'wtul.wav', 'eyho.wav', 'aftu.wav', 'tyul.wav'],
    19: ['adyup.wav', 'wfhj;.wav', 'aegjl.wav', 'atgj;'] // Perfect Pitch
};

// Play note
const playTune = (key) => {
    if (!pianoEnabled || chordIsPlaying) return;

    const audio = new Audio(`audio/BetterPianoNotes/${key}.wav`);
    audio.volume = 0.7;
    audio.play();

    activeAudio[key] = audio;
};

// Play chord
const playLevelSounds = (level) => {
    chordIsPlaying = true;

    const audio = new Audio(`audio/Chords/${currentChord}`);
    audio.volume = 1;
    audio.play();

    audio.onended = () => {
        chordIsPlaying = false;
        playButton.disabled = false;
        recordButton.disabled = false;
    };

    playButton.disabled = true;
};

// Stop audio when releasing key or click
const stopTune = (key) => {
    if (activeAudio[key]) {
        const audio = activeAudio[key];

        const fadeOutInterval = setInterval(() => {
            if (audio.volume > 0.1) {
                audio.volume -= 0.1;
            } else {
                audio.pause();
                clearInterval(fadeOutInterval);
                audio.remove();
                delete activeAudio[key];
            }
        }, 50);

        setTimeout(() => {
            clearInterval(fadeOutInterval);
            audio.pause();
            audio.remove();
            delete activeAudio[key];
        }, 550);
    }
};

const pressedKey = (e) => {
    if (!pianoEnabled) return;
    const key = e.key.toLowerCase();
    if (allKeys.includes(key) && !pressedKeys.has(key)) {
        playTune(key);
        pressedKeys.add(key);

        const clickedKey = document.querySelector(`[data-key="${key}"]`);
        clickedKey.classList.add("active");

        if (recording) {
            recordButton.classList.add("recording");
            verifyUserInput(key);
        }
    }
};
const releasedKey = (e) => {
    if (!pianoEnabled) return;
    const key = e.key.toLowerCase();
    if (pressedKeys.has(key)) {
        stopTune(key);
        pressedKeys.delete(key);

        const clickedKey = document.querySelector(`[data-key="${key}"]`);
        clickedKey.classList.remove("active");
    }
};

// Enable or Disable all piano events
const enablePiano = () => {
    pianoEnabled = true;
};
const disablePiano = () => {
    pianoEnabled = false;
};

// Update piano screen
const updateLevelDisplay = () => {
    currentChord = chords[currentLevel][Math.floor(Math.random() * chords[currentLevel].length)];
    startingNote = currentChord[0]; // Extract the starting note from the chord name
    highlightStartingNote();

    const levelDisplay = document.querySelector('.level');
    const difficultyDisplay = document.querySelector('.difficulty');
    const progressDisplay = document.querySelector('.progress');

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

    levelDisplay.innerHTML = `Level: ${currentLevel}`;
    difficultyDisplay.innerHTML = `Difficulty: ${difficulty}`;
    progressDisplay.innerHTML = `0/${currentChord.length - 4}`;

    renderLives();
};

const updateProgressDisplay = () => {
    const progressDisplay = document.querySelector('.progress');
    const correctKeys = document.querySelectorAll('.correct').length;
    progressDisplay.innerHTML = `${correctKeys}/${currentChord.length - 4}`;
};

const updateLivesDisplay = () => {
    renderLives();
};

const renderLives = () => {
    const livesContainer = document.getElementById('lives-container');
    livesContainer.innerHTML = ''; // Clear existing hearts

    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('i');
        heart.classList.add('fa-solid', 'fa-heart');
        livesContainer.appendChild(heart);
    }
};

// Checks current played note
const verifyUserInput = (key) => {
    const chordKeys = currentChord.replace('.wav', '').split('');
    const keyElement = document.querySelector(`[data-key="${key}"]`);

    if (keyElement.classList.contains("correct") || keyElement.classList.contains("incorrect")) {
        return;
    }

    if (chordKeys.includes(key)) { // correct
        keyElement.classList.add("correct");
        keyElement.classList.remove("incorrect");
        score++;
    } else { // incorrect
        keyElement.classList.add("incorrect");
        keyElement.classList.remove("correct");
        lives--;
        updateLivesDisplay();
        if (lives <= 0) {
            // Handle game over
            addUserToLeaderboard(score);
            showGameOverScreen();
            return;
        }
    }

    updateProgressDisplay();

    // Check if all chord keys are guessed
    const allCorrect = chordKeys.every(chordKey => {
        return document.querySelector(`[data-key="${chordKey}"]`).classList.contains("correct");
    });

    if (allCorrect) {
        if (currentLevel === 19) {
            // Handle game over
            addUserToLeaderboard(score);
            showGameOverScreen();
            return;
        }

        // Disable recording and reset state
        recordButton.classList.remove("recording");
        recording = false;
        playButton.disabled = true;
        recordButton.disabled = true;

        // Visual feedback for completion
        recordButton.querySelector('i').className = 'fa-solid fa-circle-check';
        // Show level completed message
        showLevelCompletedMessage();

        // Move to the next level after 1.5s
        setTimeout(() => {
            playButton.disabled = false;
            currentLevel++;
            resetKeyColors();
            updateLevelDisplay();
        }, 1500);
    }
};

const showLevelCompletedMessage = () => {
    const screen = document.querySelector('.screen');
    screen.classList.add('hidden-children');
    setTimeout(() => {
        screen.classList.remove('hidden-children');
    }, 1500);
};

const resetKeyColors = () => {
    pianoKeys.forEach(key => {
        key.classList.remove("correct", "incorrect", "starting-note", "active");
    });
};

const highlightStartingNote = () => {
    resetKeyColors();
    const startingNoteKey = document.querySelector(`[data-key="${startingNote}"]`);
    startingNoteKey.classList.add("starting-note");
};

// Listeners for key press and click
pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key);
    key.addEventListener("mousedown", () => {
        if (pianoEnabled) {
            playTune(key.dataset.key);
            key.classList.add("active");
        }
        if (recording) {
            recordButton.classList.add("recording");
            verifyUserInput(key.dataset.key);
        }
    });
    key.addEventListener("mouseup", () => {
        if (pianoEnabled) {
            stopTune(key.dataset.key);
            key.classList.remove("active");
        }
    });
});
document.addEventListener("keydown", pressedKey);
document.addEventListener("keyup", releasedKey);

// PLAY BTN
playButton.addEventListener('click', () => {
    playButton.disabled = true;
    recordButton.disabled = true;
    recording = false;
    recordButton.classList.remove("recording");

    // Reset the record button icon to its original state
    recordButton.querySelector('i').className = 'fa-solid fa-circle';

    playLevelSounds(currentLevel);
});

// RECORD BTN
recordButton.addEventListener('click', () => {
    recordButton.disabled = true;
    recording = true;
    recordButton.classList.add("recording");
    enablePiano();
});

// INSTRUCTIONS PANEL
let mKeyPressed = false;
const pianoSection = document.getElementById('piano-section');

document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'm' && !mKeyPressed && pianoSection.style.display === 'block') {
        toggleInstructionsPanel();
        mKeyPressed = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key.toLowerCase() === 'm') {
        mKeyPressed = false;
    }
});

function toggleInstructionsPanel() {
    const instructionsPanel = document.getElementById('instructions-panel');
    const pianoSection = document.getElementById('piano-section');
    const logoSection = document.getElementById('logo-section');

    if (instructionsPanel.classList.contains('show')) {
        instructionsPanel.classList.remove('show');
        pianoSection.classList.remove('blur');
        logoSection.classList.remove('blur');
        pianoEnabled = true;
    } else {
        instructionsPanel.classList.add('show');
        pianoSection.classList.add('blur');
        logoSection.classList.add('blur');
        pianoEnabled = false;
    }
}


// Initialize the level and difficulty display
updateLevelDisplay();


// Store username to Leaderboard
const addUserToLeaderboard = (score) => {
    const username = localStorage.getItem('username');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzPFg9ERXcw5_-J-XGzeQh1QD72OTJZisQyRNXyNTFgZYtVDBAXT-qV2qu-2YEuZzwH/exec';
    fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'add',
            username: username,
            score: score
        })
    });
};

// Game Over and Page Redirect
const showGameOverScreen = () => {
    document.getElementById('piano-section').style.display = 'none';
    const gameOverSection = document.getElementById('game-over');
    document.getElementById('final-score').innerText = score;
    gameOverSection.style.display = 'block';
    pianoEnabled = false;

    setTimeout(() => {
        window.location.href = 'leaderboard.html';
    }, 4444);
};
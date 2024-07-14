const pianoKeys = document.querySelectorAll(".piano-keys .key");

let allKeys = [],
    pressedKeys = new Set(); // Set to keep track of pressed keys

const playTune = (key) => {
    const audio = new Audio(`tunes/${key}.wav`); // create a new Audio object for each key press
    audio.play(); // play audio

    const clickedKey = document.querySelector(`[data-key="${key}"]`); // get the clicked key element
    clickedKey.classList.add("active"); // add active class to the clicked key element
    setTimeout(() => { // remove active class after 150 ms from the clicked key element
        clickedKey.classList.remove("active");
    }, 150);
}

pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key); // add data-key value to the allKeys array
    // call playTune function with passing data-key value as an argument
    key.addEventListener("click", () => playTune(key.dataset.key));
});

const pressedKey = (e) => {
    const key = e.key.toLowerCase();
    if (allKeys.includes(key) && !pressedKeys.has(key)) {
        playTune(key);
        pressedKeys.add(key);
    }
}

const releasedKey = (e) => {
    const key = e.key.toLowerCase();
    if (pressedKeys.has(key)) {
        pressedKeys.delete(key);
    }
}

document.addEventListener("keydown", pressedKey);
document.addEventListener("keyup", releasedKey);

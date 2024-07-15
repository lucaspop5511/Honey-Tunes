document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const nameForm = document.getElementById('name-form');
    const pianoSection = document.getElementById('piano-section');
    const usernameInput = document.getElementById('username');
    const logoSection = document.getElementById('logo-section');
    const logoIMG = document.getElementById('logoIMG');
    const earTraining = document.getElementById('earTraining');

    startButton.addEventListener('click', function () {
        startButton.style.display = 'none';
        logoSection.classList.add('move-up');
        logoIMG.classList.add('shrink');
        earTraining.style.opacity = '0';

        logoIMG.addEventListener('animationend', function () {
            nameForm.style.display = 'block';
        }, { once: true });
    });

    nameForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = usernameInput.value.trim();
        if (username) {
            // Store username (could be sent to server later)
            localStorage.setItem('username', username);

            // Hide greeting section and show piano section
            document.getElementById('greeting-section').style.display = 'none';
            pianoSection.style.display = 'block';

            // Enable piano keys
            enablePiano();
        }
    });

    // Disable piano keys until name is submitted
    disablePiano();
});

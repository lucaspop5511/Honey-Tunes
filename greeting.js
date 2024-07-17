document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const nameForm = document.getElementById('name-form');
    const pianoSection = document.getElementById('piano-section');
    const usernameInput = document.getElementById('username');
    const logoSection = document.getElementById('logo-section');
    const logoIMG = document.getElementById('logoIMG');
    const earTraining = document.getElementById('earTraining');

    const maxChars = 10;

    usernameInput.setAttribute('autocomplete', 'off');

    usernameInput.addEventListener('input', function () {
        this.style.width = ((this.value.length) * 0.5) + 1.7 + 'ch';

        const cursorPosition = this.selectionStart;
        let value = usernameInput.value;

        if (this.value.length > 0) {
            // Capitalize the first letter and lowercase the rest
            if (this.value.length > maxChars) {
                this.value = this.value.slice(0, maxChars);
            }
            else {
                const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                this.value = capitalizedValue;
            }

            if (cursorPosition === 0) {
                this.setSelectionRange(1, 1);
            } else {
                this.setSelectionRange(cursorPosition, cursorPosition);
            }
        }

        this.value = this.value.replace(/[^a-zA-Z]/g, '');

    });

    startButton.addEventListener('click', function () {
        startButton.style.display = 'none';
        logoSection.classList.add('move-up');
        logoIMG.classList.add('shrink');
        earTraining.style.opacity = '0';

        logoIMG.addEventListener('animationend', function () {
            nameForm.style.display = 'block';
            usernameInput.focus(); // Focus on the input field after showing the form
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

// script.js
function toggleMenu() {
    const menu = document.querySelector('.menu');
    const honeyJarLid = document.getElementById('jar-lid');
    let isOpened = menu.style.display === 'flex' ? true : false;

    if (isOpened) {
        honeyJarLid.style.bottom = '-85px';
    }
    else {
        honeyJarLid.style.bottom = '180px';
    }

    menu.classList.toggle('show');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

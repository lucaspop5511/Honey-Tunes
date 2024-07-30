document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const nameForm = document.getElementById('name-form');
    const pianoSection = document.getElementById('piano-section');
    const usernameInput = document.getElementById('username');
    const logoSection = document.getElementById('logo-section');
    const logoIMG = document.getElementById('logoIMG');
    const earTraining = document.getElementById('earTraining');
    const usernameDisplay = document.getElementById('username-display');
    const body = document.body;

    const maxChars = 10;

    usernameInput.setAttribute('autocomplete', 'off');

    // Vignette effect on hover (Start BTN)
    startButton.addEventListener('mouseenter', function () {
        body.classList.add('hover-vignette');
    });
    startButton.addEventListener('mouseleave', function () {
        body.classList.remove('hover-vignette');
    });

    usernameInput.addEventListener('input', function () {
        this.style.maxWidth = ((this.value.length) * 0.5) + 3.5 + 'ch';

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

        // Restrict to only letters
        this.value = this.value.replace(/[^a-zA-Z]/g, '');
    });

    startButton.addEventListener('click', function () {
        startButton.style.display = 'none';
        logoSection.classList.add('move-up');
        logoIMG.classList.add('shrink');
        earTraining.style.opacity = '0';

        logoIMG.addEventListener('animationend', function () {
            nameForm.style.display = 'block';
            usernameInput.focus(); // Focus on the input immediately
        }, { once: true });
    });

    nameForm.addEventListener('submit', function (event) {
        event.preventDefault();
        document.body.classList.add('blured');
        body.classList.add('hover-vignette');

        const username = usernameInput.value.trim();
        if (username) {
            // Store username
            localStorage.setItem('username', username);

            // Hide greeting section and show piano section
            document.getElementById('name-form').style.display = 'none';
            pianoSection.style.display = 'block';

            // Show the username in the top right corner
            usernameDisplay.style.display = 'block';
            usernameDisplay.innerText = `" ${username} "`;

            // Enable piano keys
            enablePiano();
        }
    });

    // Disable piano keys until name is submitted
    disablePiano();

    // Ensure focus stays in the input
    usernameInput.addEventListener('keydown', function (event) {
        // Prevent Tab and Escape keys from shifting focus
        if (event.key === 'Tab' || event.key === 'Escape') {
            event.preventDefault();
            usernameInput.focus();
        }
    });

    usernameInput.addEventListener('blur', function () {
        // Refocus if the input loses focus
        setTimeout(() => {
            usernameInput.focus();
        }, 0);
    });
});

// HoneyJar Menu
function toggleMenu() {
    const menu = document.querySelector('.menu');
    const honeyJarLid = document.getElementById('jar-lid');
    const honeyJar = document.getElementById('honey-jar');
    let isOpened = menu.style.display === 'flex';

    if (isOpened) {
        honeyJarLid.style.bottom = '-85px';
        setTimeout(() => {
            menu.classList.remove('show');
        }, 30);
        setTimeout(() => {
            menu.style.display = 'none';
        }, 500);

    } else {
        honeyJarLid.style.bottom = '110px';
        menu.style.display = 'flex';
        setTimeout(() => {
            menu.classList.add('show');
        }, 10);
    }
}

// Loading Screen
window.addEventListener('load', function () {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none';
});

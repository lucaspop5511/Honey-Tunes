document.addEventListener('DOMContentLoaded', function () {
    const nameForm = document.getElementById('name-form');
    const pianoSection = document.getElementById('piano-section');
    const usernameInput = document.getElementById('username');

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

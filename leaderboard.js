document.addEventListener("DOMContentLoaded", () => {
    const leaderboardTableBody = document.getElementById('leaderboard-body');

    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    const displayLeaderboard = () => {
        const leaderboardRows = leaderboard.map((entry, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${entry.username}</td>
                <td>${entry.level}</td>
            </tr>
        `).join('');
        leaderboardTableBody.innerHTML = leaderboardRows;
    };

    window.addUserToLeaderboard = (username, level) => {
        leaderboard.push({ username, level });
        leaderboard.sort((a, b) => b.level - a.level);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    };

    displayLeaderboard();
});

document.addEventListener("DOMContentLoaded", () => {
    const leaderboardTableBody = document.getElementById('leaderboard-body');
    const googleScriptURL = 'https://script.google.com/macros/s/AKfycbzPFg9ERXcw5_-J-XGzeQh1QD72OTJZisQyRNXyNTFgZYtVDBAXT-qV2qu-2YEuZzwH/exec';

    const displayLeaderboard = async () => {
        try {
            const response = await fetch(`${googleScriptURL}?action=get`);
            const leaderboard = await response.json();
            if (Array.isArray(leaderboard)) {
                const leaderboardRows = leaderboard.map((entry, index) => `
                    <tr>
                        <td>${entry.rank}</td>
                        <td>${entry.username}</td>
                        <td>${entry.score}</td>
                    </tr>
                `).join('');
                leaderboardTableBody.innerHTML = leaderboardRows;
            } else {
                leaderboardTableBody.innerHTML = '<tr><td colspan="3">No data available</td></tr>';
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            leaderboardTableBody.innerHTML = '<tr><td colspan="3">Error loading data</td></tr>';
        }
    };


    window.addUserToLeaderboard = async (username, score) => {
        try {
            await fetch(googleScriptURL, {
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
            displayLeaderboard();
        } catch (error) {
            console.error('Error adding user to leaderboard:', error);
        }
    };

    displayLeaderboard();
});

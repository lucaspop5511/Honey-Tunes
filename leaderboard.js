document.addEventListener("DOMContentLoaded", () => {
    const leaderboardTableBody = document.getElementById('leaderboard-body');
    const googleScriptURL = 'https://script.google.com/macros/s/AKfycbxT4yVHB3og3t72cvImaJUrQ8dyrPlRi1YKRkxbF5lBoWBddqa7MR98iFzXRY_m2TM6/exec';

    const displayLeaderboard = async () => {
        try {
            const response = await fetch(`${googleScriptURL}?action=get`);
            const leaderboard = await response.json();
            if (Array.isArray(leaderboard)) {
                const leaderboardRows = leaderboard.map((entry, index) => `
                    <tr>
                        <td>${entry.rank}</td>
                        <td>${entry.username}</td>
                        <td>${entry.level}</td>
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


    window.addUserToLeaderboard = async (username, level) => {
        try {
            await fetch(googleScriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'add',
                    username: username,
                    level: level
                })
            });
            displayLeaderboard();
        } catch (error) {
            console.error('Error adding user to leaderboard:', error);
        }
    };

    displayLeaderboard();
});

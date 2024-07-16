document.addEventListener('DOMContentLoaded', function() {
    fetch('/user-data')
        .then(response => response.json())
        .then(data => {
            if (data.name) {
                document.getElementById('user-stats').textContent = `Name: ${data.name}, Bench: ${data.bench}, Deadlift: ${data.deadlift}, Squat: ${data.squat}`;
            } else {
                document.getElementById('user-stats').textContent = 'No stats available';
            }
        })
        .catch(error => console.error('Error:', error));
});

document.getElementById('updateStatsButton').addEventListener('click', function() {
    document.getElementById('updateStatsForm').style.display = 'block';
});

document.getElementById('updateStatsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const bench = document.getElementById('bench').value;
    const deadlift = document.getElementById('deadlift').value;
    const squat = document.getElementById('squat').value;

    fetch('/submit-stats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bench, deadlift, squat })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update the stats display with the new stats
            document.getElementById('user-stats').textContent = `Bench: ${bench}, Deadlift: ${deadlift}, Squat: ${squat}`;
            document.getElementById('updateStatsForm').style.display = 'none';
        } else {
            document.getElementById('error-message').textContent = data.error || 'Failed to update stats';
        }
    })
    .catch(error => console.error('Error:', error));
});

fetch('/stats-data')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#statsTable tbody');
        data.forEach(entry => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = entry.name;
            row.appendChild(nameCell);
            
            const imgCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = entry.imagePath;
            img.alt = `${entry.name}'s profile picture`;
            img.width = 100;
            imgCell.appendChild(img);
            row.appendChild(imgCell);

            const benchCell = document.createElement('td');
            benchCell.textContent = entry.bench;
            row.appendChild(benchCell);
            
            const deadliftCell = document.createElement('td');
            deadliftCell.textContent = entry.deadlift;
            row.appendChild(deadliftCell);
            
            const squatCell = document.createElement('td');
            squatCell.textContent = entry.squat;
            row.appendChild(squatCell);

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));

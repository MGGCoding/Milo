document.addEventListener('DOMContentLoaded', () => {
    fetch('/user-data')
        .then(response => response.json())
        .then(data => {
            if (data.name) {
                document.getElementById('profile-name').textContent = data.name;
                document.getElementById('profile-pic').src = data.imagePath;
            }
        })
        .catch(error => console.error('Error:', error));
});

document.addEventListener('DOMContentLoaded', function() {
    loadComponent('header', '/html/header.html');
});

function loadComponent(elementId, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            initializeProfileMenu();
            updateUserProfile();
        })
        .catch(error => console.error('Error loading component:', error));
}

function initializeProfileMenu() {
    const profilePic = document.getElementById('profilePic');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const logoutButton = document.getElementById('logoutButton');

    profilePic.addEventListener('click', function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/signup';
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    window.addEventListener('click', function(event) {
        if (!event.target.matches('#profilePic')) {
            dropdownMenu.style.display = 'none';
        }
    });
}

function updateUserProfile() {
    fetch('/user-data')
        .then(response => response.json())
        .then(data => {
            if (data.name) {
                document.getElementById('profileName').textContent = data.name;
                document.getElementById('profilePic').src = data.imagePath;
            }
        })
        .catch(error => console.error('Error:', error));
}

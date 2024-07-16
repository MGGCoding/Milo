document.getElementById('statsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector('.form').style.display = 'none';
        window.location.href = '/stats';
    })
    .catch(error => console.error('Error:', error));
});

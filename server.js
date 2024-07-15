const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 8080; // Changed the port number here

// Set up storage engine for file uploads
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

let stats = [];

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/submit', upload.single('image'), (req, res) => {
    const { name, bench, deadlift, squat } = req.body;
    let imagePath;

    if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
    } else {
        imagePath = 'logo.png'; // Default image
    }

    const newStat = { name, bench, deadlift, squat, imagePath };
    stats.push(newStat);

    res.json(newStat);
});

app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/forum', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'forum.html'));
});

app.get('/challenges', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'challenges.html'));
});

app.get('/stats-data', (req, res) => {
    res.json(stats);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

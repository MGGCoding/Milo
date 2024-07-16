const express = require('express');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const PORT = 8080;

// Set up Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Ensure usernames are unique
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bench: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    deadlift: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    squat: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'logo.png'
    },
    clicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

sequelize.sync();

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Routes to serve static HTML files
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'home.html'));
});

app.get('/forum', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'forum.html'));
});

app.get('/challenges', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'challenges.html'));
});

app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'stats.html'));
});

app.post('/signup', async (req, res) => {
    const { name, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const user = await User.create({ name, password: hashedPassword });
        req.session.userId = user.id; // Set the user session
        res.json({ success: true });
    } catch (error) {
        console.error('Error creating user:', error); // Log the error details
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({ where: { name } });
        if (user && await bcrypt.compare(password, user.password)) { // Compare the password
            req.session.userId = user.id;
            res.json({ success: true, user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error); // Log the error
        res.status(500).json({ error: 'Failed to login', details: error.message });
    }
});

app.post('/submit', upload.single('image'), async (req, res) => {
    const { name, bench, deadlift, squat } = req.body;
    let imagePath;

    if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
    } else {
        imagePath = 'logo.png';
    }

    try {
        const user = await User.create({ name, bench, deadlift, squat, imagePath });
        req.session.userId = user.id;
        res.json(user);
    } catch (error) {
        console.error('Error during submission:', error); // Log the error
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
});

app.post('/update-profile-pic', upload.single('newProfilePic'), async (req, res) => {
    if (req.session.userId) {
        try {
            const user = await User.findByPk(req.session.userId);
            if (user) {
                user.imagePath = `/uploads/${req.file.filename}`;
                await user.save();
                res.json({ success: true, imagePath: user.imagePath });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating profile picture:', error); // Log the error
            res.status(500).json({ error: 'Failed to update profile picture', details: error.message });
        }
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

app.get('/stats-data', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error fetching stats:', error); // Log the error
        res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
    }
});

app.post('/update-clicks', async (req, res) => {
    if (req.session.userId) {
        const user = await User.findByPk(req.session.userId);
        if (user) {
            user.clicks += 1;
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error); // Log the error
        res.status(500).json({ error: 'Failed to fetch user', details: error.message });
    }
});

app.get('/user-data', async (req, res) => {
    if (req.session.userId) {
        try {
            const user = await User.findByPk(req.session.userId);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error fetching user:', error); // Log the error
            res.status(500).json({ error: 'Failed to fetch user', details: error.message });
        }
    } else {
        res.json({});
    }
});

app.post('/submit-stats', async (req, res) => {
    if (req.session.userId) {
        try {
            const user = await User.findByPk(req.session.userId);
            if (user) {
                const { bench, deadlift, squat } = req.body;
                user.bench = bench;
                user.deadlift = deadlift;
                user.squat = squat;
                await user.save();
                res.json({ success: true });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating stats:', error); // Log the error
            res.status(500).json({ error: 'Failed to update stats', details: error.message });
        }
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// imports
const path = require('path');
const result = require('dotenv').config({ path: './.env' });

console.log('dotenv configuration loaded:', result); // Log to confirm dotenv is loaded

const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const mongoConfig = require('./config/mongoConfig');

const app = express(); // Initialize the app
app.set('views', path.join(__dirname, 'views')); // Set the views directory

console.log('MONGO_URL:', process.env.MONGO_URL); // Log the specific MongoDB connection string

// Connect to MongoDB
mongoConfig();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Use method-override for forms
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static('public/uploads'));

// Set view engine
app.set('view engine', 'ejs');

// Routes
app.use("", require("./routes/routes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port or change the PORT environment variable.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

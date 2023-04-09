// Required Libraries
const express = require('express');
const path = require('path');
const fs = require('fs');

// Potential use of uuid (to be determined later)
const uuid = require('./helpers/uuid');


// PORT
const PORT = 3001;


// App instance of express
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET routes


// Note: included this along with the wildcard as a base of get operations
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


// GET request for notes
app.get('/api/notes', (req, res) => {
    // Read the contents of the db.json file
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json')));

    // Send the notes as a JSON response
    res.json(notes);

    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});

// POST request for notes


// Event listener designated for the bottom of the code:
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);


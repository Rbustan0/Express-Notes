// Required Libraries
const express = require('express');
const path = require('path');
const fs = require('fs');

// Potential use of uuid (to be determined later)
const uuid = require('./helpers/uuid');


// PORT
const PORT = process.env.PORT || 3001;


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




// API NOTES




// GET request for notes
app.get('/api/notes', (req, res) => {
    // Read the contents of the db.json file
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
    console.log(notes);
    // Send the notes as a JSON response
    res.json(notes);

    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});

// POST request for notes
app.post('/api/notes', (req, res) => {

    // Following similar structure to folder 20
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment of variables for new object.
    const { title, text } = req.body;

    if (title && text) {
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error in reading file');
            } else {
                // I think its more efficient to include this snippit inside
                const notes = JSON.parse(data);

                const newNote = {
                    id: uuid(),
                    title,
                    text,
                };

                // Will show user that their post response was a success
                const response = {
                    status: 'success',
                    body: newNote,
                };

                // push notes to array
                notes.push(newNote);
                // appends if written inside of the read method
                fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                    } else {
                        console.info('Successfully added note!');
                        res.json(response);
                    }
                });
            }
        });
    } else {
        res.status(400).send('Please include a title and text for the note.');
    }
});

// DELETE Route, going to attempt to use filter rather than the select in the courses example.
app.delete('/api/notes/:id', (req, res) => {
    
    // saving myself the hassle of typing this out multiple times
    const noteId = req.params.id;

    console.info(`${req.method} request received to delete note with id ${noteId}`);

    // Read the contents of the db.json file just as before
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));

    // Filter out the note with the specified ID
    const filteredNotes = notes.filter(note => note.id !== noteId);

    // Check if any notes were deleted
    if (notes.length !== filteredNotes.length) {
        // Write the updated notes to the db.json file
        fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(filteredNotes, null, 2));
        console.info(`Note with id ${noteId} was deleted.`);
        res.sendStatus(204);
    } else {
        // If no notes were deleted, send a 404 response
        console.warn(`Note with id ${noteId} was not found.`);
        res.sendStatus(404);
    }
});



// Needs to be at the bottom to avoid it conflicting with other GETs and POSTs in the code.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});



// Event listener designated for the bottom of the code:
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);

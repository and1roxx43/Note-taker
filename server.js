// npm packages needed to run this app.
const express = require('express');
const fs = require('fs');
const path = require('path');

//Create an express server
const app = express();

//Initialise a port 
const PORT = process.env.PORT || 3001;

// to store notes
const allSavedNotes = require('./db/db.json');

// Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//to serve CSS and JavaScript files in public directory:
app.use(express.static('public'));


// Below code handles when users "visit" a page.
app.get('/api/notes', (req, res) => res.json(allSavedNotes.slice(1)));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

// If no matching route is found default to home
app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));


// Create notes
function createNote(body, notesArray) {
    const newNotes = body;

    if (!Array.isArray(notesArray)) notesArray = [];

    if (notesArray.length === 0) notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNotes);

    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notesArray));
    return newNotes;
}

//post /api/notes should read the db.json file and return all saved notes as JSON
app.post('/api/notes', (req, res) => {
    const newNotes = createNote(req.body, allSavedNotes);
    res.json(newNotes);
});

// Delete notes
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++){
        let notes = notesArray[i];

        if(notes.id == id) {
            notesArray.splice(i,1);
            fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notesArray));

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allSavedNotes);
    res.json(true);
});


//To start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
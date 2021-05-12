const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = 8080;

const allSavedNotes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => res.json(allSavedNotes.slice(1)));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

// If no matching route is found default to home
app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

function createNote(body, notesArray) {
    const newNotes = body;

    if (!Array.isArray(notesArray)) notesArray = [];

    if (notesArray.length === 0) notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNotes);

    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notesArray, null, 2));
    return newNotes;
}

app.post('/api/notes', (req, res) => {
    const newNotes = createNote(req.body, allSavedNotes);
    res.json(newNotes);
});

function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++){
        let notes = notesArray[i];

        if(notes.id == id) {
            notesArray.splice(i,1);
            fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notesArray, null, 2));

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allSavedNotes);
    res.json(true);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;
const id = require('uniqid');
const notes = require('./db/db.json');



// Init Express
const express = require('express');
const app = express();


app.use(express.static(path.join(__dirname, 'public')));                                // Serve static files
app.use(express.urlencoded({ extended: true }));                                        // Parse URL-encoded bodies
app.use(express.json());                                                                // Parse JSON bodies

// Create your endpoints/route handlers here


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {                                                       // GET /api/notes should read the db.json file and return all saved notes as JSON.
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {                // Read the db.json file
        if (err) throw err;
        res.json(JSON.parse(data));                                                         // Return all saved notes as JSON.
    });
});

app.post('/api/notes', (req, res) => {                                                      // POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {                // Read the db.json file
        if (err) throw err;
        const notes = JSON.parse(data);                                                     // Parse the data
        notes.push(req.body);                                                               // Add it to the db.json file
        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {  // Write the db.json file
            if (err) throw err;
            res.json(notes);                                                                // Return the new note to the client.
        });

    });
});
app.delete('/api/notes/:id', (req, res) => {                                                // DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete.
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {                // Read the db.json file
        if (err) throw err;
        const notes = JSON.parse(data);                                                     // Parse the data
        const newNotes = notes.filter(note => note.id !== req.params.id);                   // Remove the note with the given id property.
        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(newNotes), (err) => {
            if (err) throw err;
            res.json(newNotes);
        });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
}
);

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));






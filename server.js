// Basic setup for express/path
const express = require('express');
const path = require('path');
const fs = require('fs');
// creates a variable for the db.json to enter into code
const termData = require('./db/db.json');
const PORT = 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//gets notes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

// app.get for /api/notes
app.get('/api/notes', (req, res) => {
  res.json(termData)
});
//app.post for /api/notes
app.post('/api/notes', (req, res) => {
  const createdNote = createNote(req.body, termData)
  res.json(createdNote)
});

const createNote = (body, notesArr) => {
  const newNote = body
  body.id = notesArr.length
  notesArr.push(newNote)
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify(notesArr)
  )
  return newNote;
}


// app.delete for /api/notes
app.delete('/api/notes/:id', (req, res) => {
  deleteNote(req.params.id, termData)
  res.json(true)
})

const deleteNote = (id, notesArr) => {
  for (let index = 0; index < notesArr.length; index++) {
    let note = notesArr[index];
    if (note.id == id) {
      //splice picks index, and deletes from that index from moving foward a specified ammount
      notesArr.splice(index, 1)
      fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArr)
      )
      break
    }

  }
}
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
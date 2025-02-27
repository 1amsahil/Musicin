import e from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "url";


const app = e();
const port = 300;
app.use(e.static('public'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/songs', (req, res) => {
    const songDir = path.join(__dirname, "public/songs/Mix/");
    fs.readdir(songDir, (err, files) => {
        if(err) {
            console.error("error");
            res.status(500).json({error: "failed to load songs"})
        }
        else {
            const songs = files.filter(file => file.endsWith('.mp3'));
            res.json(songs);
        }
    })
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})

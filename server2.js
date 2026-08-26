import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const port = process.env.PORT || 8000;

const app = express(); 

// setup static folder
// app.use(express.static(path.join(__dirname, 'public')))

let posts = [
    {id: 1, title: 'Blabla'},
    {id: 2, title: 'Blabla2'}
]

// Get all posts
app.get('/api/posts', (req, res) =>{
    res.json(posts)
})

// Get single posts
app.get('/api/posts/:id', (req, res) =>{
    const id = parseInt(req.params.id)
    res.json(posts,filter((post) => post.id === id))
})

app.listen(port, () => console.log(`Server is running on port ${port}`));
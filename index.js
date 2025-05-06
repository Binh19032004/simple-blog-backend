const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route gốc để kiểm tra server
app.get('/', (req, res) => {
  res.send('Welcome to Simple Blog API!');
});

// In-memory storage for posts
let posts = [
  { id: 1, title: 'First Post', content: 'This is the first post.', slug: 'first-post', createdAt: new Date() }
];
let nextId = 2;

// Login endpoint (trang 90)
app.post('/api/login', bodyParser.json(), (req, res) => {
  const creds = {
    username: req.body.username,
    password: req.body.password
  };
  if (creds.username === 'admin' && creds.password === '123') {
    res.status(200).send({ message: 'Login successful', user: { username: creds.username } });
  } else {
    res.status(400).send({ message: 'Login failed' });
  }
});

// Get all posts (dựa trên phong cách trang 39-41)
app.get('/api/posts', (req, res) => {
  res.send(posts);
});

// Get post by slug (dựa trên phong cách trang 57-58)
app.get('/api/post/:slug', (req, res) => {
  const post = posts.find(p => p.slug === req.params.slug);
  if (!post) {
    return res.status(404).send({ message: 'Post not found' });
  }
  res.send(post);
});

// Add new post (dựa trên phong cách trang 65-67)
app.post('/api/posts', bodyParser.json(), (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send({ message: 'Title and content are required' });
  }
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newPost = {
    id: nextId++,
    title,
    content,
    slug,
    createdAt: new Date()
  };
  posts.push(newPost);
  res.status(201).send(newPost);
});

// Start server (trang 35)
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
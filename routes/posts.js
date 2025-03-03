import express, { json } from "express"
import bodyParser from 'body-parser';

const postrouter = express.Router();

postrouter.use(bodyParser.json());

let posts = [];
let comments = [];

// Rota para listar postagens
postrouter.get('/posts', (req, res) => {
  res.json(posts);
});

// Rota para criar uma postagem
postrouter.post('/posts', (req, res) => {
  const { title, content } = req.body;
  const newPost = { id: posts.length + 1, title, content };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// Rota para adicionar um comentário
postrouter.post('/posts/:id/comments', (req, res) => {
  const { content } = req.body;
  const postId = parseInt(req.params.id);
  const newComment = { id: comments.length + 1, content, postId };
  comments.push(newComment);
  res.status(201).json(newComment);
});

export default postrouter
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { randomBytes } = require('crypto');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];

  comments.push({
    id: commentId,
    content,
    status: 'pending',
  });

  commentsByPostId[req.params.id] = comments;

  try {
    await axios.post('http://event-bus-ip-service:4005/events', {
      type: 'CommentCreated',
      data: {
        id: commentId,
        content,
        status: 'pending',
        postId: req.params.id,
      }
    });
   } catch(e) {
     console.log('error: ', e.message);
   }

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log('Comments: event received', type);

  const {
    postId,
    id,
    status,
    content,
  } = data;

  if (type === 'CommentModerated') {
    const comments = commentsByPostId[postId] || [];
    const comment = comments.find((c) => c.id === id);

    comment.status = status;

    try {
      await axios.post('http://event-bus-ip-service:4005/events', {
        type: 'CommentUpdated',
        data: {
          id,
          content,
          status,
          postId,
        }
      });
     } catch(e) {
       console.log('error: ', e.message);
     }
  }
  res.send({});
});

app.listen(4001, () => console.log('comments: listening on 4001'));

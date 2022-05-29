const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = {
      id,
      title,
      comments: [],
    };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];

    post.comments.push({
      id,
      content,
      status,
    });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((c) => c.id === id);

    comment.status = status;
    comment.content = content;
  }
}

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  console.log('Query: event received', type);

  handleEvent(type, data);
  
  res.send({});
});

app.listen(4002, async () => {
  console.log('query: listening on port 4002');

  try {
    const result = await axios.get('http://event-bus-ip-service:4005/events');

    result.data.forEach(event => {
      console.log('processing event: ', event.type);
      handleEvent(event.type, event.data);
    });
  } catch(e) {
    console.log('error: ', e);
  }
});

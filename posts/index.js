const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { randomBytes } = require('crypto');

const app = express();

app.use(bodyParser.json());
app.use(cors())

const posts = {};

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  try {
    await axios.post('http://event-bus-ip-service:4005/events', {
      type: 'PostCreated',
      data: {
        id,
        title,
      },
    });
  } catch(e) {
    console.log('error: ', e.message)
  }
  
  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  console.log('Posts: event received', type);

  res.send({});
});

app.listen(4000, () => {
  console.log('v1');
  console.log('posts: listening on port 4000');
});

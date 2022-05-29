const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log('Moderation: event received', type);

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange')
      ? 'rejected'
      : 'approved';

    try {
      await axios.post('http://event-bus-ip-service:4005/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          content: data.content,
          status,
          postId: data.postId
        }
      });
    } catch(e) {
      console.log('error: ', e.message);
    }
  }

  res.send({});
});

app.listen(4003, () => console.log('moderation: listening on port 4003'));

const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.use(bodyParser.json());

const events = [];

app.post('/events', async (req, res) => {
  const event = req.body;
  console.log('Events: event received', event.type);

  events.push(event);

  const posts = 'http://posts-ip-service:4000/events';
  const comments = 'http://comments-ip-service:4001/events';
  const query = 'http://query-ip-service:4002/events';
  const moderation = 'http://moderation-ip-service:4003/events';

  const calls = [
    axios.post(posts, event),
    axios.post(comments, event),
    axios.post(query, event),
    axios.post(moderation, event),
  ];

  const results = await Promise.allSettled(calls);

  results.forEach(result => {
    if (result.status === 'rejected') {
      console.warn(`Event failed ${result.reason}`);
    }
  });

  res.status(201).send(true);
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => console.log('events: listening on port 4005'));

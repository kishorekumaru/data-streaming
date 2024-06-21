import * as PlayHT from 'playht';
import express from 'express';
import dotenv from 'dotenv';
import { streamGptText } from './streamGptText.js';
dotenv.config();

// Initialize PlayHT SDK
try {
  PlayHT.init({
    apiKey:
      process.env.PLAYHT_API_KEY,
    userId:
      process.env.PLAYHT_USER_ID,
  });
} catch (error) {
  console.log('Failed to initialise PlayHT SDK', error.message);
}

const app = express();

const serveSecret = express.static('./secret');
const serveDemo = express.static('./demo');

// Serve the UI
// app.use('/', express.static('./demo'));
app.use('/', function (req, res, next) {
    if (
      !process.env.PLAYHT_API_KEY ||
      !process.env.PLAYHT_USER_ID ||
      !process.env.OPENAI_API_KEY) {
    serveSecret(req, res, next);
  } else {
    serveDemo(req, res, next);
  }
});

// Endpoint to convert ChatGPT prompt response into audio stream
app.get('/say-prompt', async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).send('ChatGPT prompt not provided in the request');
      return;
    }
    
    res.setHeader('Content-Type', 'audio/mpeg');

    // Create a text stream from ChatGPT responses
    const gptStream = await streamGptText(prompt);
    
    // Generate a stream with PlayHT's API
    const stream = await PlayHT.stream(gptStream);

    // Pipe response audio stream to browser
    stream.pipe(res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Stream text from ChatGPT
app.get('/stream-text', async (req, res) => {
    try {
      const { prompt } = req.query;
  
      if (!prompt || typeof prompt !== 'string') {
        res.status(400).send('ChatGPT prompt not provided in the request');
        return;
      }
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Transfer-Encoding', 'chunked');
  
      // Create a text stream from ChatGPT responses
      const gptStream = await streamGptText(prompt);
      
      // Generate a stream with PlayHT's API
      gptStream.pipe(res);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

app.listen(3000, () => {
  console.log('Express server initialized');
});

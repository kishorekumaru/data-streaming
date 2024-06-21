import OpenAI from 'openai/index.mjs';
import dotenv from 'dotenv';
import { Readable } from 'node:stream';
dotenv.config();

let openai;
try {
  openai = new OpenAI({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.log('Failed to initialise OpenAI SDK', error.message);
}

// ChatGPT's API returns an object. Convert it to a string with just the text.
export async function streamGptText(prompt) {
  if (!openai) {
    throw 'OpenAI API not initialised';
  }
  
  // Create a stream of GPT-3 responses
  const stream = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
    stream: true,
  });

  const [chatGptResponseStream] = stream.tee()


  return new Readable({
    async read() {
      for await (const part of chatGptResponseStream) {
        // Add only the text to the stream
        this.push(part.choices[0]?.delta?.content || '');
      }
      this.push(null);
    },
  });
}

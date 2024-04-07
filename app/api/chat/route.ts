import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    temperature: 1,
    max_tokens: 45,
    messages: [
      {
        role: "system",
        content:
          "You are an art connoisseur. Compose a short description of the painting with details of how the painting looks such as the style,elements and colours of the painting. Generate a painting description based on the example: [Examples] Example1: painting description: painting of a dark starry sky in Venice.Colours: indigo, deep blue, yellow, white. Elements: a moon and star-filled night sky above small houses and trees.Style:  oil painting Create a very short summary that uses 40 completion_tokens or less",
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
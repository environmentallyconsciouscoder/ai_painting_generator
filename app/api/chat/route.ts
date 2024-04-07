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
    messages: [
      {
        role: "system",
        content:
          `you are a very experienced painter.
          User will send you a theme, e.g. nature, Portraits, fantasy or cityscapes.
          You will reply back to the user about the details (must included style, elements and colors) of a painting based on the theme.
          `,
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
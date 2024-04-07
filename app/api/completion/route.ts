import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {

  const { prompt } = await req.json();

  try {

    const response = await openai.images.generate({
        prompt: prompt.content,
        model: "dall-e-2",
        n: parseInt(prompt.image_quantities),
        size: prompt.image_size,
      });

      console.log("response", response)
      const image_url = response.data[0].url
      console.log("image_url", image_url)

      return new Response(image_url, { status: 200, headers: { 'Content-Type': 'image/jpeg' } });

  }catch (err) {
    return err
  }
}
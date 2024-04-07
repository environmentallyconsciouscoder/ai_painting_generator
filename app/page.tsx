"use client";

import { useState, useCallback, useEffect } from 'react';
import { useCompletion, useChat } from 'ai/react';

export default function Chat() {
  const { messages, append, isLoading } = useChat();
  const [content, setContent] = useState('');
  const [painting, setPainting] = useState("https://generative-placeholders.glitch.me/image?width=600&height=300&style=triangles&gap=30");

  const { complete } = useCompletion({
    api: '/api/completion',
  });

  const themes = [
    { value: "Nature" },
    { value: "Portraits" },
    { value: "Fantasy" },
    { value: "Cityscapes" },
  ];

  const image_sizes = [
    { value: "512x512" },
    { value: "256x256" },
  ];

  const [state, setState] = useState({
    themes: "",
    image_size: "",
    image_quantities: 1,
  });

  useEffect(() => {
    messages.map((message) => {
      if (message?.role === "assistant") {
        setContent(message.content)
      }
    })
  }, [messages]);

  const getFeedback = useCallback(
    async (c: any) => {
      const completion = await complete(c);
      if (!completion) throw new Error('Failed to give feedback');
      console.log("completion", completion)
      setPainting(completion)
    },
    [complete],
  );

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">AI Painting Generator App</h2>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">themes</h3>
            <div className="flex flex-wrap justify-center">
              {themes.map(({ value }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="themes"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {` ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading || ( !state.themes)}
            onClick={() =>
              append({
                role: "user",
                content: ` ${state.themes}`
              }
              )
            }
          >
            Generate painting description
          </button>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">image sizes</h3>
            <div className="flex flex-wrap justify-center">
              {image_sizes.map(({ value }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="image_size"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {` ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

        <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
          <h3 className="text-xl font-semibold">Number of paintings</h3>
          <div className="flex items-center">
            <span>1</span>
            <input
              className="w-full mt-2 bg-red-500"
              max="4"
              min="1"
              step="1"
              type="range"
              name="image_quantities"
              onChange={handleChange}
              />
            <span>4</span>
          </div>
        </div>

          <div
            hidden={
              messages.length === 0 ||
              messages[messages.length - 1]?.content.startsWith("Generate")
            }
            className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
          >
            {messages[messages.length - 1]?.content}
          </div>

          <div>
            <button
              disabled={isLoading || ( !state.image_quantities || !state.image_size || !content)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              onClick={() =>
              getFeedback({content: content, image_size: state.image_size, image_quantities: state.image_quantities})}>
                Generate painting
            </button>
          </div>
          <img src={painting} alt="painting generated from open ai"></img>
        </div>
      </div>
    </main>
  );
}


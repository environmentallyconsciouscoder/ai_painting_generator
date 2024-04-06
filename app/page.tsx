"use client";

import { useState, useCallback, useEffect } from 'react';
import { useCompletion, useChat } from 'ai/react';

export default function Chat() {
  const { messages, append, isLoading } = useChat();
  const [content, setContent] = useState('');
  const [feedback, setFeedback] = useState('');

  const { complete } = useCompletion({
    api: '/api/completion',
  });

  const tones = [
    { value: "witty" },
    { value: "silly" },
    { value: "Sarcastic" },
    { value: "dark" },
    { value: "goofy" },
  ];

  const topics = [
    { value: "work" },
    { value: "people" },
    { value: "animals" },
    { value: "food" },
    { value: "television" },
  ];

  const kindOfJokes = [
    { value: "pun" },
    { value: "knock-knock" },
    { value: "story" },
  ];

  const [state, setState] = useState({
    topic: "",
    tone: "",
    kindOfJoke: ""
  });

  const [temperature, setTemperature] = useState(1);

  useEffect(() => {
    // console.log("messages", messages)
    messages.map((message) => {
      if (message?.role === "assistant") {
        setContent(message.content)
      }
    })
  }, [messages]);

  const getFeedback = useCallback(
    async (c: string) => {
      const completion = await complete(c);
      if (!completion) throw new Error('Failed to give feedback');
      // alert(completion);
      setFeedback(completion)
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
            <h2 className="text-3xl font-bold">Joke Generator App</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the joke by selecting topic, tone, kind of joke and Temperature.
            </p>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Topics</h3>
            <div className="flex flex-wrap justify-center">
              {topics.map(({ value }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="topic"
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
            <h3 className="text-xl font-semibold">Tones</h3>
            <div className="flex flex-wrap justify-center">
              {tones.map(({ value }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="tone"
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
            <h3 className="text-xl font-semibold">Kind of Joke</h3>
            <div className="flex flex-wrap justify-center">
              {kindOfJokes.map(({ value }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="kindOfJoke"
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
          <h3 className="text-xl font-semibold">Temperature</h3>
          <label className="hidden" htmlFor="temperature">
            Temperature
          </label>
          <div className="flex items-center">
            <span>🧊</span>
            <input
              className="w-full mt-2 bg-red-500"
              max="1"
              min="0"
              step="0.1"
              type="range"
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
            <span>🔥</span>
          </div>
        </div>


          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading || ( !state.tone || !state.topic || !state.kindOfJoke || !temperature)}
            onClick={() =>
              append({
                role: "user",
                content: `give me a ${state.kindOfJoke} joke about ${state.topic} in a ${state.tone} tone`
              },
              {
                options: {
                  body: {
                    temperature: temperature
                  }
                }
              }
              )
            }
          >
            Generate Story
          </button>

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
              disabled={isLoading || ( !state.tone || !state.topic || !state.kindOfJoke || !temperature || !content)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50" onClick={() => getFeedback(content)}>Get Feedback on joke</button>
          </div>

          <div
            className={feedback? "bg-opacity-25 bg-gray-700 rounded-lg p-4": ""}
          >
            {feedback}
          </div>

        </div>
      </div>
    </main>
  );
}
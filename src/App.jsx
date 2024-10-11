import { useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import './App.css';

function App() {
  const [platform, setPlatform] = useState('youtube'); // Default to YouTube
  const [task, setTask] = useState('');
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('Loading...');
  const [loading, setLoading] = useState(false);
  console.log(import.meta.env.VITE_API_KEY);
 const apiKey=import.meta.env.VITE_API_KEY;
  const handleGenerateContent = async () => {
    setLoading(true);
    setContent('Loading...');

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, // Replace with your API key
        {
          contents: [
            {
              parts: [
                {
                  text: `Generate a ${platform} ${task} based on: ${prompt}`,
                },
              ],
            },
          ],
        }
      );
      const rawContent = response.data.candidates[0].content.parts[0].text;
      const markdownContent = marked.parse(rawContent);

      setContent(markdownContent);
    } catch (error) {
      console.error('Error generating content:', error);
      setContent('Error generating content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-screen bg-gray-900 text-gray-200">
      <div className="p-8 bg-gray-800 shadow-lg rounded-md">
        <h1 className="text-3xl mb-4 font-bold text-blue-400">Headlines AI</h1>

        <label className="block mb-2 font-medium text-gray-300">Choose Platform:</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border border-gray-600 rounded w-full mb-4 p-3 bg-gray-700 text-gray-200"
        >
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
        </select>

        <label className="block mb-2 font-medium text-gray-300">Task:</label>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border border-gray-600 rounded w-full mb-4 p-3 bg-gray-700 text-gray-200"
          placeholder="e.g., title, description"
        />

        <label className="block mb-2 font-medium text-gray-300">Prompt:</label>
        <textarea
          className="border border-gray-600 rounded w-full mb-4 p-3 bg-gray-700 text-gray-200"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          cols="30"
          rows="4"
          placeholder="Enter your prompt here"
        ></textarea>

        <button
          onClick={handleGenerateContent}
          className={`bg-blue-500 text-white rounded p-3 w-full text-lg font-semibold mt-4 hover:bg-blue-600 transition duration-300 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Content'}
        </button>
      </div>

      <div className="p-8 bg-gray-850 shadow-lg rounded-md col-span-1">
        <h2 className="text-2xl mb-2 font-bold text-gray-300">Generated Content:</h2>
        <div
          className="border border-gray-600 rounded p-4 bg-gray-700 text-sm text-gray-200 w-full h-3/4 resize-none overflow-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </div>
  );
}

export default App;

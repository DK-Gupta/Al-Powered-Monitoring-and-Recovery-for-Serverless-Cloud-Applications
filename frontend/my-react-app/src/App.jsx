import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleShorten = async () => {
    if (!url) return alert("Please enter a URL");

    // Replace with your actual backend API
    const response = await fetch("http://localhost:5000/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ longUrl: url }),
    });

    const data = await response.json();
    setShortUrl(data.shortUrl);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          🔗 Link Shortener
        </h1>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter long URL"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleShorten}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
          Shorten
        </button>

        {shortUrl && (
          <div className="mt-6">
            <p className="text-gray-600 mb-2">Shortened URL:</p>
            <div
              className="text-indigo-700 font-medium break-words cursor-pointer underline hover:text-indigo-900"
              onClick={handleCopy}
            >
              {shortUrl}
            </div>
          </div>
        )}

        <p className="mt-6 text-sm text-gray-500">
          📌 Paste a long URL and click "Shorten" to get a short link. <br />
          📎 Click the short link to copy it easily.
        </p>
      </div>
    </div>
  );
}

export default App;

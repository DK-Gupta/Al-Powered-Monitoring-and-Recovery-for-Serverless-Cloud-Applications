import { useState } from "react";
import UrlInput from "./components/UrlInput";
import UrlResult from "./components/UrlResult";
import Instructions from "./components/Instructions";

function App() {
  const [shortUrl, setShortUrl] = useState("");

  const handleShorten = async (longUrl) => {
    console.log("Trying to shorten:", longUrl);
    try {
      const res = await fetch("https://link-shortener.dkg.workers.dev/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: longUrl }),
      });

      const data = await res.json();
      console.log("Shortened data:", data);
      if (data.shortUrl) setShortUrl(data.shortUrl);
    } catch (error) {
      console.error("Shorten failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          🔗 Link Shortener
        </h1>
        <UrlInput onShorten={handleShorten} />
        <UrlResult shortUrl={shortUrl} />
        <Instructions />
      </div>
    </div>
  );
}

export default App;

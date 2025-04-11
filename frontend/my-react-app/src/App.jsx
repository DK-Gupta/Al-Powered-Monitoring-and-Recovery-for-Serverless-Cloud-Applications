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
    <div className="app-wrapper">
      <div className="card">
        <h1 className="title">🔗 Link Shortener</h1>
        <UrlInput onShorten={handleShorten} />
        <UrlResult shortUrl={shortUrl} />
        <Instructions />
      </div>
    </div>
  );
}

export default App;

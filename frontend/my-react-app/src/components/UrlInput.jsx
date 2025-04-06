import { useState } from "react";

export default function UrlInput({ onShorten }) {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (url.trim()) {
      console.log("Submitted URL:", url); // ✅ Debug line
      await onShorten(url);
      setUrl("");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <input
        type="url"
        placeholder="Enter long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
        required
      />
      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
      >
        Shorten
      </button>
    </form>
  );
}

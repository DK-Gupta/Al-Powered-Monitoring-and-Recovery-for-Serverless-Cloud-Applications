import { useState } from "react";

export default function UrlInput({ onShorten }) {
  const [input, setInput] = useState("");

  const handleClick = () => {
    if (input) onShorten(input);
  };

  return (
    <div>
      <input
        className="url-input"
        type="text"
        placeholder="Enter long URL"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="shorten-btn" onClick={handleClick}>Shorten</button>
    </div>
  );
}


function UrlResult({ shortUrl }) {
  if (!shortUrl) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="mt-4 text-center">
      <p className="text-lg">
        Short URL:{" "}
        <a href={shortUrl} className="text-blue-600 underline" target="_blank">
          {shortUrl}
        </a>
      </p>
      <button
        onClick={handleCopy}
        className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Copy
      </button>
    </div>
  );
}

export default UrlResult;

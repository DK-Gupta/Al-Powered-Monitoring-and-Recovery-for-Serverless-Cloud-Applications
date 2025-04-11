function UrlResult({ shortUrl }) {
  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
    }
  };

  return (
    <div className="url-result">
      {shortUrl && (
        <>
          <p>
            <strong>Short URL:</strong>{" "}
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
          </p>
          <button className="copy-btn" onClick={handleCopy}>Copy</button>
        </>
      )}
    </div>
  );
}


export default UrlResult;

import React, { useEffect, useRef } from "react";

const RecordingComponent = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.onload = () => {
        iframe.contentWindow.postMessage({ type: "initialize" }, "*");
      };
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="http://localhost:5000/iframe"
      style={{ width: "100%", height: "100%" }}
    ></iframe>
  );
};

export default RecordingComponent;

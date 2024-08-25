import React, { useRef, useEffect } from 'react';

export default function JumboSpinner(props) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, [videoRef]);

  return (
    <div {...props}>
      <video
        ref={videoRef}
        src="/jumbo.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{ display: 'block' }}
      />
    </div>
  );
}

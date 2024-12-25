'use client'

// components/DotLottiePlayer.js
import React, { useEffect } from 'react';

const DotLottiePlayer = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <dotlottie-player
      src="https://lottie.host/17292e34-0df7-46da-9c18-89659069e2df/w3sTyUaRjB.json"
      background="transparent"
      speed="1"
      style={{ width: '300px', height: '300px' }}
      loop
      autoplay
    ></dotlottie-player>
  );
};

export default DotLottiePlayer;

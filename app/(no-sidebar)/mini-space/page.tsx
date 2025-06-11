"use client";

import { useEffect, useState } from "react";

export default function MiniSpacePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`max-w-3xl mx-auto px-4 py-12 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
      <h1 className="text-2xl font-bold mb-6">Mini Space</h1>
      <p className="mb-4">This is my mini space on the internet - a place for experimentation and creativity.</p>
      <p>Coming soon with more content and features!</p>
    </div>
  );
}
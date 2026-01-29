import React, { useState, useEffect } from "react";

const sampleText = "Practice makes perfect typing speed test";

function TypingTest() {

  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isRunning]);

  const startTest = () => {
    setIsRunning(true);
    setInput("");
    setTimeLeft(60);
  };

  const calculateWPM = () => {
    const words = input.trim().split(" ").length;
    return Math.round(words);
  };

  return (
    <div className="box">
      <h2>Typing Speed Test</h2>

      <p>{sampleText}</p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={!isRunning}
      />

      <h3>Time Left: {timeLeft}s</h3>

      <button onClick={startTest}>Start</button>

      {timeLeft === 0 && <h3>WPM: {calculateWPM()}</h3>}
    </div>
  );
}

export default TypingTest;

import React, {
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";
import "./App.css";

function App() {
  const inputRef = useRef(null);

  /* ===== STATE ===== */
  const [text, setText] = useState("");
  const [input, setInput] = useState("");

  const [time, setTime] = useState(60);
  const [selectedTime, setSelectedTime] = useState(60);

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(false);
  const [dark, setDark] = useState(true);

  const [accuracy, setAccuracy] = useState(0);
  const [cps, setCps] = useState(0);
  const [speed, setSpeed] = useState(0);

  /* ===== LOAD PARAGRAPH ===== */
  const loadParagraph = async () => {
    try {
      const res = await fetch("https://dummyjson.com/quotes");
      const data = await res.json();

      const paragraph = Array.from({ length: 4 })
        .map(
          () =>
            data.quotes[
              Math.floor(Math.random() * data.quotes.length)
            ].quote
        )
        .join(" ");

      setText(paragraph);
      setInput("");
      setFinished(false);
      setError(false);
    } catch {
      setText("Failed to load text...");
    }
  };

  useEffect(() => {
    loadParagraph();
  }, []);

  /* ===== END TEST (FIXED WITH useCallback) ===== */
  const endTest = useCallback(() => {
    setRunning(false);
    setFinished(true);

    if (!input.length) return;

    const correctChars = input
      .split("")
      .filter((c, i) => c === text[i]).length;

    const acc = Math.round(
      (correctChars / input.length) * 100
    );

    const cpsValue = (input.length / selectedTime).toFixed(2);

    setAccuracy(acc);
    setCps(cpsValue);
    setSpeed(Math.round(cpsValue * 60));
  }, [input, text, selectedTime]);

  /* ===== TIMER ===== */
  useEffect(() => {
    if (!running || paused) return;

    if (time > 0) {
      const timer = setTimeout(
        () => setTime(t => t - 1),
        1000
      );
      return () => clearTimeout(timer);
    }

    endTest();
  }, [time, running, paused, endTest]);

  /* ===== CONTROLS ===== */
  const startTest = () => {
    setRunning(true);
    setPaused(false);
    setFinished(false);
    setTime(selectedTime);
    loadParagraph();

    setTimeout(() => {
      inputRef.current.focus();
    }, 100);
  };

  const pauseTest = () => {
    if (running) setPaused(p => !p);
  };

  const resetTest = () => {
    setRunning(false);
    setPaused(false);
    setFinished(false);
    setTime(selectedTime);
    loadParagraph();
  };

  const handleType = e => {
    if (!running || paused || finished) return;

    const value = e.target.value;
    setInput(value);

    const lastIndex = value.length - 1;
    if (text[lastIndex]) {
      setError(value[lastIndex] !== text[lastIndex]);
    }
  };

  /* ===== RENDER TEXT ===== */
  const renderText = () =>
    text.split("").map((char, i) => {
      let cls = "";

      if (i < input.length) {
        cls = char === input[i] ? "correct" : "wrong";
      } else if (i === input.length && running && !finished) {
        cls = "active";
      }

      return (
        <span key={i} className={cls}>
          {char}
        </span>
      );
    });

  const progress = text
    ? (input.length / text.length) * 100
    : 0;

  /* ===== UI ===== */
  return (
    <div className={dark ? "app dark" : "app light"}>
      <h1>Typing Speed Test</h1>

      <div className={error ? "alert error" : "alert"}>
        {finished
          ? "Test Completed"
          : paused
          ? "Paused"
          : error
          ? "Typing mistake!"
          : "Typing..."}
      </div>

      <div className="controls">
        <select
          onChange={e => setSelectedTime(+e.target.value)}
        >
          <option value="30">30s</option>
          <option value="60">60s</option>
          <option value="120">120s</option>
        </select>

        <span>Time: {time}s</span>

        <button onClick={() => setDark(d => !d)}>
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="progressBar">
        <div style={{ width: `${progress}%` }} />
      </div>

      <div
        className="paragraph"
        onClick={() => inputRef.current.focus()}
      >
        {renderText()}
      </div>

      <input
        ref={inputRef}
        className="hiddenInput"
        value={input}
        onChange={handleType}
        onBlur={() => inputRef.current.focus()}
      />

      <div className="buttons">
        <button onClick={startTest}>Start</button>
        <button onClick={pauseTest}>
          {paused ? "Resume" : "Pause"}
        </button>
        <button onClick={resetTest}>Reset</button>
      </div>

      {finished && (
        <div className="results">
          <p>Accuracy: {accuracy}%</p>
          <p>CPS: {cps}</p>
          <p>Speed (CPM): {speed}</p>
        </div>
      )}
    </div>
  );
}

export default App;

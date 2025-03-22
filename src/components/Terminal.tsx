import { useState, useEffect, useRef } from 'react';

export default function MatrixTerminal() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([
        'CLASS:PERSON<>',
        'DEF_INTERFACE_INIT<AGE>',
        'SELF_NAME = <NAME>',
        'SELF_AGE = <AGE>',
        '',
        'SYSTEM READY...',
        'Type "help" to see available commands.'
    ]);
    const [cursorVisible, setCursorVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [powerOn, setPowerOn] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Simulate TV turning on
    useEffect(() => {
        const timer = setTimeout(() => {
            setPowerOn(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Blinking cursor effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setCursorVisible(v => !v);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, []);

    // Auto-scroll to bottom when history changes
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    // Focus input when terminal is clicked
    useEffect(() => {
        const handleClick = () => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        };

        if (terminalRef.current) {
            terminalRef.current.addEventListener('click', handleClick);
        }

        return () => {
            if (terminalRef.current) {
                terminalRef.current.removeEventListener('click', handleClick);
            }
        };
    }, []);

    // Handle command input
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user input to history
        setHistory(prev => [...prev, `> ${input}`]);

        // Simulate processing
        setLoading(true);

        // Here you would call your RAG framework
        setTimeout(() => {
            let response = "Command not recognized. Type 'help' for available commands.";

            if (input.toLowerCase() === 'help') {
                response = `
Available commands:
- about: Display information about me
- skills: List my technical skills
- projects: Show my portfolio projects
- contact: How to get in touch with me
- experience: My work experience
- education: My educational background
- clear: Clear the terminal
        `;
            } else if (input.toLowerCase() === 'about') {
                response = "I'm a front-end engineer specializing in React and TypeScript. Welcome to my portfolio.";
            } else if (input.toLowerCase() === 'clear') {
                setHistory([]);
                setLoading(false);
                setInput('');
                return;
            }

            // Add response to history
            setHistory(prev => [...prev, response]);
            setLoading(false);
            setInput('');
        }, 500);
    };

    // CRT screen styles as CSS classes
    const crtStyles = `
    @keyframes flicker {
      0% { opacity: 0.97; }
      5% { opacity: 0.95; }
      10% { opacity: 0.97; }
      15% { opacity: 0.96; }
      20% { opacity: 0.97; }
      25% { opacity: 0.95; }
      30% { opacity: 0.96; }
      35% { opacity: 0.97; }
      40% { opacity: 0.96; }
      45% { opacity: 0.97; }
      50% { opacity: 0.96; }
      55% { opacity: 0.95; }
      60% { opacity: 0.96; }
      65% { opacity: 0.97; }
      70% { opacity: 0.96; }
      75% { opacity: 0.97; }
      80% { opacity: 0.96; }
      85% { opacity: 0.95; }
      90% { opacity: 0.96; }
      95% { opacity: 0.97; }
      100% { opacity: 0.96; }
    }

    @keyframes scanline {
      0% { transform: translateY(0); }
      100% { transform: translateY(100%); }
    }

    @keyframes power-on {
      0% { opacity: 0; transform: scale(0.8); }
      10% { opacity: 0.3; transform: scale(0.9); }
      30% { opacity: 0.5; transform: scale(0.95); }
      50% { opacity: 0.7; transform: scale(0.97); }
      70% { opacity: 0.9; transform: scale(0.99); }
      100% { opacity: 1; transform: scale(1); }
    }

    .tv-outer-casing {
      background: #111;
      border-radius: 40px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(0, 0, 0, 0.5);
      border: 4px solid #333;
      width: 100%;
      max-width: 800px;
      aspect-ratio: 4/3;
    }

    .tv-screen-border {
      background: #000;
      border-radius: 30px;
      padding: 5px;
      overflow: hidden;
      position: relative;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
      height: 100%;
    }

    .tv-screen {
      background: #002200;
      border-radius: 25px;
      overflow: hidden;
      position: relative;
      height: 100%;
    }

    .tv-content {
      position: relative;
      z-index: 2;
      transform-origin: center center;
      padding: 20px;
      height: 100%;
      font-family: monospace;
      font-size: 16px;
      color: #00ff41;
      text-shadow: 0 0 8px rgba(0, 255, 65, 0.8);
      opacity: 0;
      line-height: 1.4;
      display: flex;
      flex-direction: column;
    }

    .terminal-scroll-area {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: thin;
      scrollbar-color: #00ff41 #001100;
    }

    .terminal-scroll-area::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .terminal-scroll-area::-webkit-scrollbar-track {
      background: #001100;
      border-radius: 4px;
    }

    .terminal-scroll-area::-webkit-scrollbar-thumb {
      background-color: #00ff41;
      border-radius: 4px;
      border: 2px solid #002200;
    }

    .input-area {
      margin-top: 10px;
      flex-shrink: 0;
      display: flex;
    }

    .command-prompt {
      display: flex;
      align-items: center;
    }

    .horizontal-lines {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 2px
      );
      pointer-events: none;
      z-index: 3;
    }

    .crt-scanline {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(
        to bottom,
        rgba(0, 255, 65, 0.15),
        rgba(0, 255, 65, 0.35) 50%,
        rgba(0, 255, 65, 0.15)
      );
      animation: scanline 6s linear infinite;
      opacity: 0.8;
      pointer-events: none;
      z-index: 4;
    }

    .crt-flicker {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      animation: flicker 0.1s infinite;
      opacity: 0.03;
      pointer-events: none;
      mix-blend-mode: overlay;
      z-index: 5;
    }

    .screen-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(
        ellipse at center,
        rgba(0, 255, 65, 0.2) 0%,
        rgba(0, 20, 0, 0.2) 80%,
        rgba(0, 0, 0, 0.5) 100%
      );
      pointer-events: none;
      z-index: 1;
    }

    .screen-glare {
      position: absolute;
      top: -50%;
      left: -50%;
      right: -50%;
      bottom: -50%;
      background: radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 70%
      );
      transform: rotate(-45deg);
      pointer-events: none;
      z-index: 6;
    }

    .vignette {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(
        ellipse at center,
        rgba(0, 0, 0, 0) 60%,
        rgba(0, 0, 0, 0.7) 100%
      );
      pointer-events: none;
      z-index: 7;
      border-radius: 25px;
    }

    .screen-curve {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      box-shadow: inset 0 0 100px 40px rgba(0, 0, 0, 0.6);
      border-radius: 25px;
      pointer-events: none;
      z-index: 8;
    }

    .power-on-animation {
      animation: power-on 1s ease-in-out forwards;
    }

    input.retro-input {
      background: transparent;
      border: none;
      outline: none;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      text-shadow: inherit;
      width: calc(100% - 20px);
      caret-color: transparent;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      opacity: 0;
    }

    .cursor-blink {
      display: inline-block;
      width: 10px;
      height: 16px;
      background-color: #00ff41;
      animation: blink 1s step-end infinite;
      vertical-align: middle;
      box-shadow: 0 0 8px #00ff41;
      margin-left: 2px;
    }

    .input-text {
      margin-left: 2px;
    }

    @keyframes blink {
      from, to { opacity: 1; }
      50% { opacity: 0; }
    }
  `;

    return (
        <>
            <style>{crtStyles}</style>
            <div className="flex items-center justify-center w-full h-screen bg-black p-4">
                <div className="tv-outer-casing">
                    <div className="tv-screen-border">
                        <div className="tv-screen">
                            {/* Screen effects */}
                            <div className="screen-glow"></div>
                            <div className="horizontal-lines"></div>
                            <div className="crt-scanline"></div>
                            <div className="crt-flicker"></div>
                            <div className="screen-glare"></div>
                            <div className="vignette"></div>
                            <div className="screen-curve"></div>

                            {/* Terminal content */}
                            <div
                                className={`tv-content ${powerOn ? 'power-on-animation' : ''}`}
                                style={{ opacity: powerOn ? 1 : 0 }}
                            >
                                {/* Scrollable terminal area */}
                                <div
                                    ref={terminalRef}
                                    className="terminal-scroll-area"
                                    onClick={() => inputRef.current?.focus()}
                                >
                                    {/* Display history */}
                                    {history.map((line, index) => (
                                        <div key={index} className="whitespace-pre-wrap mb-1">
                                            {line}
                                        </div>
                                    ))}

                                    {/* Loading indicator */}
                                    {loading && (
                                        <div className="my-1">PROCESSING...</div>
                                    )}
                                </div>

                                {/* Input line with cursor - fixed at bottom */}
                                <form onSubmit={handleSubmit} className="input-area">
                                    <div className="command-prompt relative">
                                        <span>&gt; </span>
                                        <span className="input-text">{input}</span>
                                        {cursorVisible && (
                                            <span className="cursor-blink"></span>
                                        )}
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            className="retro-input"
                                            autoFocus
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
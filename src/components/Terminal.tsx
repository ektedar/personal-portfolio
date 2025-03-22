import { useEffect, useRef, useState } from 'react';

export default function MatrixTerminal() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [cursorVisible, setCursorVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [powerOn, setPowerOn] = useState(false);
    const [bootComplete, setBootComplete] = useState(false);
    const [bootSequenceComplete, setBootSequenceComplete] = useState(false);
    const [jitter, setJitter] = useState({ x: 0, y: 0 });
    const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
    const [currentLineChars, setCurrentLineChars] = useState('');
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Boot sequence messages with typical computer startup info
    const bootSequence = [
        'BIOS v2.67 - SYSTEM INITIALIZATION',
        'CPU: 80486DX2 66MHz',
        'MEM CHK: 16384KB OK',
        'DISK 0: QUANTUM FIREBALL 850MB',
        'LOADING OPERATING SYSTEM...',
        '',
        'KERNEL v3.12 LOADED',
        'INITIALIZING SUBSYSTEMS...',
        'NETWORK: OFFLINE',
        'USER INTERFACE: ACTIVE',
        '',
        'LOGIN: admin',
        'PASSWORD: ********',
        '',
        'AUTHENTICATION SUCCESSFUL',
        'IDENTITY VERIFICATION PROTOCOL ENGAGED',
        'LOADING PERSONAL INTERFACE... COMPLETE',
        '',
        'SYSTEM READY. Type "help" to see available commands.'
    ];

    // Simulate TV turning on
    useEffect(() => {
        const timer = setTimeout(() => {
            setPowerOn(true);

            // Start the boot sequence after power on animation completes
            setTimeout(() => {
                setBootComplete(true);
            }, 2000); // Wait for power-on animation to finish
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Auto-typing effect for boot sequence
    useEffect(() => {
        if (!bootComplete) return;

        if (currentTypingIndex < bootSequence.length) {
            const currentMessage = bootSequence[currentTypingIndex];

            if (currentLineChars.length < currentMessage.length) {
                // Still typing the current line character by character
                const timer = setTimeout(() => {
                    // Type next character of current line
                    setCurrentLineChars(currentMessage.substring(0, currentLineChars.length + 1));
                }, currentMessage.startsWith('LOADING') ? 50 : 20); // Slower typing for loading messages

                return () => clearTimeout(timer);
            } else {
                // Finished typing current line, move to next line after a pause
                const timer = setTimeout(() => {
                    // Add the completed line to history
                    setHistory(prev => [...prev, currentLineChars]);
                    // Reset for next line
                    setCurrentLineChars('');
                    setCurrentTypingIndex(prev => prev + 1);
                }, currentMessage === '' ? 300 : 500); // Short pause for empty lines, longer for text lines

                return () => clearTimeout(timer);
            }
        } else if (!bootSequenceComplete) {
            // Mark boot sequence as complete
            setBootSequenceComplete(true);
        }
    }, [bootComplete, currentTypingIndex, currentLineChars, bootSequenceComplete]);

    // Blinking cursor effect - only when boot sequence is complete or for input
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setCursorVisible(v => !v);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, []);

    // Random screen jitter effect
    useEffect(() => {
        const jitterInterval = setInterval(() => {
            // Randomly decide if we should apply jitter
            if (Math.random() < 0.1) { // 10% chance of jitter
                setJitter({
                    x: (Math.random() * 4) - 2, // -2px to +2px
                    y: (Math.random() * 2) - 1  // -1px to +1px
                });

                // Reset jitter after a short time
                setTimeout(() => {
                    setJitter({ x: 0, y: 0 });
                }, 100);
            }
        }, 2000);

        return () => clearInterval(jitterInterval);
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
            if (inputRef.current && bootSequenceComplete) {
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
        if (!input.trim() || !bootSequenceComplete) return;

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
- interact: Interact with my conscious
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

    // Occasional static/interference effect
    const triggerInterference = () => {
        const contentElement = document.querySelector('.tv-content');
        if (contentElement && Math.random() < 0.3) { // 30% chance when triggered
            contentElement.classList.add('interference');
            setTimeout(() => {
                contentElement?.classList.remove('interference');
            }, 150);
        }
    };

    // CRT screen styles as CSS classes
    const crtStyles = `
    @keyframes flicker {
      0% { opacity: 0.97; }
      5% { opacity: 0.95; }
      10% { opacity: 0.98; }
      15% { opacity: 0.96; }
      20% { opacity: 0.97; }
      25% { opacity: 0.95; }
      30% { opacity: 0.98; }
      35% { opacity: 0.97; }
      40% { opacity: 0.96; }
      45% { opacity: 0.97; }
      50% { opacity: 0.98; }
      55% { opacity: 0.95; }
      60% { opacity: 0.97; }
      65% { opacity: 0.98; }
      70% { opacity: 0.96; }
      75% { opacity: 0.97; }
      80% { opacity: 0.98; }
      85% { opacity: 0.95; }
      90% { opacity: 0.97; }
      95% { opacity: 0.98; }
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

    @keyframes crt-on {
      0% { transform: scaleY(0.01); opacity: 0; }
      20% { transform: scaleY(0.1); opacity: 0.2; }
      40% { transform: scaleY(0.4); opacity: 0.4; }
      60% { transform: scaleY(0.6); opacity: 0.6; }
      80% { transform: scaleY(0.8); opacity: 0.8; }
      100% { transform: scaleY(1); opacity: 1; }
    }

    @keyframes text-shadow {
      0% { text-shadow: 0 0 10px rgba(255, 200, 60, 0.6); }
      50% { text-shadow: 0 0 14px rgba(255, 200, 60, 0.9); }
      100% { text-shadow: 0 0 10px rgba(255, 200, 60, 0.6); }
    }

    @keyframes static {
      0% { transform: translateX(0); }
      20% { transform: translateX(-1px); }
      40% { transform: translateX(2px); }
      60% { transform: translateX(-3px); }
      80% { transform: translateX(1px); }
      100% { transform: translateX(0); }
    }

    @keyframes vertical-roll {
      0% { transform: translateY(0); }
      100% { transform: translateY(-5px); }
    }

    @keyframes blur-effect {
      0% { filter: blur(0.5px); }
      50% { filter: blur(1.5px); }
      100% { filter: blur(0.5px); }
    }

    .fullscreen-terminal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #000;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tv-outer-casing {
      background: #111;
      border-radius: 20px;
      padding: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(0, 0, 0, 0.5);
      border: 4px solid #222;
      width: 98vw;
      height: 98vh;
      max-width: 98vw;
    }

    .tv-screen-border {
      background: #000;
      border-radius: 15px;
      padding: 3px;
      overflow: hidden;
      position: relative;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
      height: 100%;
    }

    .tv-screen {
      background: #100800;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      height: 100%;
    }

    .tv-content {
      position: relative;
      z-index: 2;
      transform-origin: center center;
      padding: 30px;
      height: 100%;
      font-family: "VT323", "Courier New", monospace;
      font-size: 38px;
      color: #FFC83C;
      text-shadow: 0 0 12px rgba(255, 200, 60, 0.8);
      opacity: 0;
      line-height: 1.3;
      display: flex;
      flex-direction: column;
      animation: text-shadow 2s infinite;
      transform: translate(${jitter.x}px, ${jitter.y}px);
      transition: transform 0.05s ease-out;
    }

    .tv-content.interference {
      animation: static 0.1s steps(4) 1, blur-effect 0.1s ease-in-out 1, vertical-roll 0.1s ease-in-out 1;
      opacity: 0.9;
    }

    .terminal-scroll-area {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: thin;
      scrollbar-color: #FFC83C #331100;
    }

    .terminal-scroll-area::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    .terminal-scroll-area::-webkit-scrollbar-track {
      background: #331100;
      border-radius: 4px;
    }

    .terminal-scroll-area::-webkit-scrollbar-thumb {
      background-color: #FFC83C;
      border-radius: 4px;
      border: 2px solid #100800;
    }

    .input-area {
      margin-top: 15px;
      flex-shrink: 0;
      display: flex;
    }

    .command-prompt {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .horizontal-lines {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.18),
        rgba(0, 0, 0, 0.18) 1px,
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
      height: 5px;
      background: linear-gradient(
        to bottom,
        rgba(255, 200, 60, 0.15),
        rgba(255, 200, 60, 0.35) 50%,
        rgba(255, 200, 60, 0.15)
      );
      animation: scanline 4s linear infinite;
      opacity: 0.7;
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
      opacity: 0.05;
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
        rgba(255, 200, 60, 0.25) 0%,
        rgba(50, 30, 0, 0.2) 80%,
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
        rgba(255, 255, 255, 0.08) 0%,
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
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 0.7) 100%
      );
      pointer-events: none;
      z-index: 7;
      border-radius: 12px;
    }

    .screen-curve {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      box-shadow: inset 0 0 150px 60px rgba(0, 0, 0, 0.7);
      border-radius: 12px;
      pointer-events: none;
      z-index: 8;
    }

    .screen-distortion {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAMqADAAQAAAABAAAAMgAAAADGaZOiAAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAAAyElEQVRoBe2ZQQrCQAxFM96i0JsUvLJ4E8G9ZCdu+gJtIHQh1EwY/Q9CGJL+/9nENFQJgQABAgQI7CRwSVJfd6ydXeZjjdO5Hs/vNs7l8rPNbbdlqtdHmeeyjee2v27z4wy6fNt8Hm9B5AiAQEsAIi0RPjcFINJE4UVLACItET43BSDSROFFSwAiLRE+NwUg0kThRUsAIi0RPjcFINJE4UVLACItET43BSDSROFFSwAiLRE+NwUg0kThRUsAIi0RPjcF/h7R/DW4EyBAgMAhApPvBWFgpLzNkwAAAABJRU5ErkJggg==');
      opacity: 0.04;
      pointer-events: none;
      z-index: 9;
      mix-blend-mode: overlay;
    }

    .bad-reception {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: repeating-linear-gradient(
        180deg,
        rgba(255, 200, 60, 0.05),
        rgba(255, 200, 60, 0.05) 1px,
        transparent 1px,
        transparent 4px
      );
      pointer-events: none;
      z-index: 10;
      opacity: 0.7;
    }

    .screen-noise {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 11;
      pointer-events: none;
      opacity: 0.05;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    .power-on-animation {
      animation: power-on 1s ease-in-out forwards, crt-on 1.5s ease-in-out forwards;
    }

    input.retro-input {
      background: transparent;
      border: none;
      outline: none;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      text-shadow: inherit;
      width: calc(100% - 30px);
      caret-color: transparent;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      opacity: 0;
    }

    .cursor-blink {
      display: inline-block;
      width: 15px;
      height: 32px;
      background-color: #FFC83C;
      animation: blink 1s step-end infinite;
      vertical-align: middle;
      box-shadow: 0 0 10px #FFC83C;
      margin-left: 5px;
    }

    .input-text {
      margin-left: 5px;
    }

    @keyframes blink {
      from, to { opacity: 1; }
      50% { opacity: 0; }
    }

    @font-face {
      font-family: 'VT323';
      font-style: normal;
      font-weight: 400;
      src: url(https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isfFJU.woff2) format('woff2');
    }
  `;

    return (
        <>
            <style>{crtStyles}</style>
            <div className="fullscreen-terminal" onClick={() => triggerInterference()}>
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
                            <div className="screen-distortion"></div>
                            <div className="bad-reception"></div>
                            <div className="screen-noise"></div>

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

                                    {/* Currently typing line with cursor */}
                                    {!bootSequenceComplete && currentLineChars && (
                                        <div className="whitespace-pre-wrap mb-1">
                                            {currentLineChars}
                                            {cursorVisible && <span className="cursor-blink"></span>}
                                        </div>
                                    )}

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
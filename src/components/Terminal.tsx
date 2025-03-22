import { useEffect, useRef, useState } from 'react';

export default function MatrixTerminal() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>(['Wake up, Neo...', 'The Matrix has you...', 'Follow the white rabbit.', 'Knock, knock, Neo.', '', 'Type "help" to see available commands.']);
    const [cursorVisible, setCursorVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Blinking cursor effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setCursorVisible(v => !v);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, []);

    // Matrix rain effect
    useEffect(() => {
        // Focus input when terminal is clicked
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

    // Auto-scroll to bottom when history changes
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    // Handle command input
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user input to history
        setHistory(prev => [...prev, `> ${input}`]);

        // Simulate processing
        setLoading(true);

        // Here you would call your RAG framework
        // For now, we'll just simulate a response
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
                response = "I'm a front-end engineer specializing in React and TypeScript. Welcome to my Matrix-inspired portfolio.";
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

    return (
        <div className="flex items-center justify-center w-full h-screen bg-black p-4">
            <div className="w-full max-w-4xl h-full flex flex-col rounded border border-green-500 bg-black bg-opacity-80 overflow-hidden shadow-lg shadow-green-500/50">
                {/* Terminal header */}
                <div className="flex items-center p-2 border-b border-green-500">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-green-500 text-center w-full font-mono">Matrix Terminal v1.0</div>
                </div>

                {/* Terminal content */}
                <div
                    ref={terminalRef}
                    className="flex-1 p-4 overflow-y-auto font-mono text-green-500 bg-black bg-opacity-90"
                >
                    {/* Display history */}
                    {history.map((line, index) => (
                        <div key={index} className="whitespace-pre-wrap mb-1">
                            {line}
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {loading && (
                        <div className="text-green-500">Processing...</div>
                    )}

                    {/* Input line with cursor */}
                    <form onSubmit={handleSubmit} className="flex items-center mt-2">
                        <span className="text-green-500 mr-2">&gt;</span>
                        <div className="relative flex-1">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-transparent text-green-500 outline-none font-mono"
                                autoFocus
                            />
                            {cursorVisible && input.length === 0 && (
                                <span className="absolute top-0 left-0 h-full w-2 bg-green-500 animate-pulse"></span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
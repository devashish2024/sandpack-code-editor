import type React from "react";

import { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TerminalProps {
  onAddDependency: (name: string, version: string) => void;
}

export function Terminal({ onAddDependency }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([
    "Welcome to terminal.",
    "Type 'npm install <package-name>' to install packages.",
    "Example: npm install lodash",
  ]);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "monospace",
      theme: {
        background: "#1e1e1e",
        foreground: "#f8f8f8",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    term.writeln("Welcome to terminal.");
    term.writeln("Type 'npm install <package-name>' to install packages.");
    term.writeln("Example: npm install lodash");
    term.writeln("");
    term.write("$ ");

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      term.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    setHistory((prev) => [...prev, `$ ${cmd}`]);

    if (cmd.startsWith("npm install") || cmd.startsWith("npm i")) {
      const parts = cmd.split(" ");
      if (parts.length < 3) {
        addToHistory("Error: Please specify a package name");
        return;
      }

      const packageArg = parts[2];
      let packageName = packageArg;
      let packageVersion = "latest";

      if (packageArg.includes("@") && !packageArg.startsWith("@")) {
        [packageName, packageVersion] = packageArg.split("@");
      }

      addToHistory(`Installing ${packageName}@${packageVersion}...`);

      // instantly adding is boring
      setTimeout(() => {
        onAddDependency(packageName, packageVersion);
        addToHistory(`Successfully installed ${packageName}@${packageVersion}`);
        addToHistory("You can now import this package in your code.");
      }, 1500);
    } else if (cmd === "clear" || cmd === "cls") {
      setHistory([]);
    } else if (cmd === "help") {
      addToHistory("Available commands:");
      addToHistory("  npm install <package-name> - Install a package");
      addToHistory("  clear - Clear the terminal");
      addToHistory("  help - Show this help message");
    } else {
      addToHistory(`Command not found: ${cmd}`);
      addToHistory("Type 'help' for available commands");
    }

    setCommand("");
  };

  const addToHistory = (message: string) => {
    setHistory((prev) => [...prev, message]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(command);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-black text-white p-2 overflow-auto font-mono text-sm">
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center p-2 border-t">
        <span className="text-primary mr-2">$</span>
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type a command..."
          className="flex-1"
        />
        <Button type="submit" size="icon" className="ml-2">
          <Send className="h-4 w-4" />
        </Button>
      </form>
      <div ref={terminalRef} className="hidden"></div>
    </div>
  );
}

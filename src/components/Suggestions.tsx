import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateAIResponse } from "@/lib/ai";

interface SuggestionsProps {
  currentCode: string;
  onApplySuggestion: (code: string) => void;
}

export function Suggestions({
  currentCode,
  onApplySuggestion,
}: SuggestionsProps) {
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSuggestion = async () => {
    if (!prompt) return;

    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const simulatedResponse = await generateSimulatedResponse(
        currentCode,
        prompt
      );
      setSuggestion(simulatedResponse);
    } catch (err) {
      setError("Failed to generate suggestion. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSimulatedResponse = async (
    code: string,
    userPrompt: string
  ) => {
    const res = await generateAIResponse(code, userPrompt);
    return res;
  };

  const applySuggestion = () => {
    if (suggestion) {
      onApplySuggestion(suggestion);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Code Suggestions</CardTitle>
          <CardDescription>
            Describe what you want to generate or improve in your code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="E.g., Create a button component"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") generateSuggestion();
                }}
              />
            </div>
            <Button
              onClick={generateSuggestion}
              disabled={isLoading || !prompt}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Suggestion
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-md">{error}</div>
      )}

      {suggestion && (
        <Card>
          <CardHeader>
            <CardTitle>AI Suggestion</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={suggestion}
              readOnly
              className="font-mono text-sm h-64"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={applySuggestion}>Apply Suggestion</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

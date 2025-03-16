import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sandpack } from "@codesandbox/sandpack-react";
import { githubLight } from "@codesandbox/sandpack-themes";
import { Loader2 } from "lucide-react";

import { FilesManager } from "@/components/FilesManager";
import { Terminal } from "@/components/Terminal";
import { Suggestions } from "@/components/Suggestions";

import { initialFiles } from "@/data/files";

export default function Editor() {
  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState("/App.js");
  const [isLoading, setIsLoading] = useState(false);
  const [dependencies, setDependencies] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  // Handle theme mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleFileChange = (newFiles: Record<string, string>) => {
    setFiles(newFiles);
  };

  const handleAddFile = (filename: string, content: string) => {
    setFiles((prev: any) => ({
      ...prev,
      [filename]: content,
    }));
  };

  const handleDeleteFile = (filename: string) => {
    if (filename === "/App.js" || filename === "/index.js") {
      return; // Prevent deletion of essential files
    }

    const newFiles = { ...files };
    delete newFiles[filename];
    setFiles(newFiles);

    if (activeFile === filename) {
      setActiveFile("/App.js");
    }
  };

  const handleAddDependency = (name: string, version: string) => {
    setDependencies((prev) => ({
      ...prev,
      [name]: version,
    }));
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Sandpack-based React Code Editor</h1>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button> */}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 flex-1 overflow-hidden">
        <div className="md:col-span-1 border-r overflow-auto">
          <Tabs defaultValue="files">
            <TabsList className="w-full">
              <TabsTrigger value="files" className="flex-1">
                Files
              </TabsTrigger>
              <TabsTrigger value="terminal" className="flex-1">
                Terminal
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex-1">
                AI
              </TabsTrigger>
            </TabsList>
            <TabsContent value="files" className="p-0">
              <FilesManager
                files={files}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                onAddFile={handleAddFile}
                onDeleteFile={handleDeleteFile}
              />
            </TabsContent>

            <TabsContent value="terminal" className="p-0 h-full">
              <Terminal onAddDependency={handleAddDependency} />
            </TabsContent>
            <TabsContent value="ai" className="p-0">
              <Suggestions
                currentCode={files[activeFile] || ""}
                onApplySuggestion={(newCode: string) => {
                  setFiles((prev: any) => ({
                    ...prev,
                    [activeFile]: newCode,
                  }));
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-3 h-full overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Sandpack
              theme={githubLight}
              template="react"
              files={files}
              customSetup={{
                dependencies: dependencies,
              }}
              options={{
                showNavigator: false,
                showTabs: true,
                showLineNumbers: true,
                showInlineErrors: true,
                wrapContent: true,
                editorHeight: "100vh",
                activeFile: activeFile,
              }}
              className="h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}

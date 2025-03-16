import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { File, FolderPlus, Trash2 } from "lucide-react";

interface FileManagerProps {
  files: Record<string, string>;
  activeFile: string;
  setActiveFile: (file: string) => void;
  onAddFile: (filename: string, content: string) => void;
  onDeleteFile: (filename: string) => void;
}

export function FilesManager({
  files,
  activeFile,
  setActiveFile,
  onAddFile,
  onDeleteFile,
}: FileManagerProps) {
  const [newFileName, setNewFileName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddFile = () => {
    if (!newFileName) return;

    let filename = newFileName;
    if (!filename.startsWith("/")) {
      filename = `/${filename}`;
    }

    // Add .js extension if not present
    if (!filename.includes(".")) {
      filename = `${filename}.js`;
    }

    const defaultContent = filename.endsWith(".css")
      ? "/* Add your styles here */"
      : "// Add your code here";

    onAddFile(filename, defaultContent);
    setNewFileName("");
    setIsDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Project Files</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <FolderPlus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New File</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Input
                placeholder="Filename (e.g. Button.js)"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddFile();
                }}
              />
              <Button onClick={handleAddFile}>Create File</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-auto">
        <ul className="p-2 space-y-1">
          {Object.keys(files).map((filename) => (
            <li key={filename}>
              <div
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  activeFile === filename ? "bg-primary/10" : "hover:bg-muted"
                }`}
                onClick={() => setActiveFile(filename)}
              >
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  <span className="text-sm truncate">
                    {filename.replace("/", "")}
                  </span>
                </div>
                {filename !== "/App.js" && filename !== "/index.js" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(filename);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

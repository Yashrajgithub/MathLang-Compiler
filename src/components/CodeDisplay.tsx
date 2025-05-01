import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

interface CodeDisplayProps {
  code: string;
}

const CodeDisplay = ({ code }: CodeDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-primary">Generated JavaScript</h3>
        <Button
          variant="outline"
          size="sm"
          className="text-sm text-primary border-primary hover:bg-primary/10 transition-all duration-300"
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4 mr-2" />
          {copied ? (
            <span className="text-green-500">Copied</span>
          ) : (
            "Copy"
          )}
        </Button>
      </div>
      <div className="relative">
        <pre className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto text-sm font-mono shadow-inner border border-gray-800">
          {code}
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;

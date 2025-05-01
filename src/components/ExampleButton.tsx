import { Button } from "./ui/button";
import { Code } from "lucide-react";

interface ExampleButtonProps {
  text: string;
  onClick: () => void;
}

const ExampleButton = ({ text, onClick }: ExampleButtonProps) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="text-sm flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-primary/30 hover:border-primary/70 focus:border-primary focus:ring-2 focus:ring-primary/30 transition duration-300 ease-in-out"
    >
      <Code className="h-4 w-4 text-primary" />
      <span className="font-semibold text-primary">{text}</span>
    </Button>
  );
};

export default ExampleButton;

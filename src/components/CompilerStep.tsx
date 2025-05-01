import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface CompilerStepProps {
  title: string;
  description: string;
  children: ReactNode;
  isActive: boolean;
}

const CompilerStep = ({ title, description, children, isActive }: CompilerStepProps) => {
  return (
    <Card 
      className={`mb-6 p-4 border-2 rounded-xl transition-all duration-300 ${
        isActive
          ? "border-primary shadow-xl ring-2 ring-primary/30"
          : "opacity-70 hover:opacity-100 border-muted hover:ring-2 hover:ring-muted/40"
      }`}
    >
      <CardHeader className="pb-3 flex items-center gap-4">
        <div 
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
            isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
          } shadow-lg transition-all duration-300`}
        >
          {title.charAt(0)}
        </div>
        <div>
          <CardTitle className="text-xl font-semibold text-primary">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="bg-gray-50 rounded-lg p-4 shadow-inner">{children}</CardContent>
    </Card>
  );
};

export default CompilerStep;

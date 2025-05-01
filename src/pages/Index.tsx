import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Code, List, TreeDeciduous, CircleDot } from "lucide-react";
import Header from "@/components/Header";
import TokenVisualizer from "@/components/TokenVisualizer";
import TreeVisualizer from "@/components/TreeVisualizer";
import CodeDisplay from "@/components/CodeDisplay";
import ResultDisplay from "@/components/ResultDisplay";
import CompilerStep from "@/components/CompilerStep";
import ExampleButton from "@/components/ExampleButton";
import * as compiler from "@/services/compiler";

const Index = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [tokens, setTokens] = useState<compiler.Token[]>([]);
  const [parseTree, setParseTree] = useState<compiler.TreeNode | null>(null);
  const [ast, setAst] = useState<compiler.TreeNode | null>(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [result, setResult] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("step-by-step");

  const examples = [
    "two plus three",
    "five minus two",
    "three times four",
    "ten divided by two",
    "one plus two times three"
  ];

  const steps = [
    { 
      title: "Lexical Analysis",
      description: "Breaking down the input text into tokens",
      icon: <List className="h-4 w-4" />,
      component: <TokenVisualizer tokens={tokens} />
    },
    {
      title: "Parse Tree",
      description: "Creating a hierarchical structure based on grammar rules",
      icon: <TreeDeciduous className="h-4 w-4" />,
      component: <TreeVisualizer tree={parseTree} title="Parse Tree" type="parse" />
    },
    {
      title: "Abstract Syntax Tree",
      description: "Simplifying to focus on the essential operations",
      icon: <TreeDeciduous className="h-4 w-4" />,
      component: <TreeVisualizer tree={ast} title="Abstract Syntax Tree" type="ast" />
    },
    {
      title: "Code Generation",
      description: "Converting the AST to executable JavaScript code",
      icon: <Code className="h-4 w-4" />,
      component: <CodeDisplay code={generatedCode} />
    },
    {
      title: "Evaluation",
      description: "Running the generated code to get the final result",
      icon: <CircleDot className="h-4 w-4" />,
      component: <ResultDisplay result={result} isLoading={isLoading} />
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter a mathematical expression in English.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      setCurrentStep(0);
      
      // Step 1: Lexical Analysis
      const newTokens = compiler.lexicalAnalysis(input);
      setTokens(newTokens);
      await wait(600);
      setCurrentStep(1);
      
      // Step 2: Parse Tree
      const newParseTree = compiler.parsing(newTokens);
      setParseTree(newParseTree);
      await wait(600);
      setCurrentStep(2);
      
      // Step 3: AST
      const newAst = compiler.createAST(newParseTree);
      setAst(newAst);
      await wait(600);
      setCurrentStep(3);
      
      // Step 4: Code Generation
      const code = compiler.generateCode(newAst);
      setGeneratedCode(code);
      await wait(600);
      setCurrentStep(4);
      
      // Step 5: Evaluation
      const evalResult = compiler.evaluate(code);
      setResult(evalResult);
      
      if (isNaN(evalResult)) {
        toast({
          title: "Evaluation Error",
          description: "Could not evaluate the expression. Please check your input.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error processing expression:", error);
      toast({
        title: "Processing Error",
        description: "An error occurred while processing your expression.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Reset state when input changes
  useEffect(() => {
    setTokens([]);
    setParseTree(null);
    setAst(null);
    setGeneratedCode("");
    setResult(0);
    setCurrentStep(0);
  }, [input]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <Card className="mb-8 shadow-lg transition-all duration-300 hover:shadow-xl rounded-xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter a math expression in English (e.g., 'two plus three')"
                  value={input}
                  onChange={handleInputChange}
                  className="flex-1 border-2 rounded-md p-3 focus:ring-2 focus:ring-primary"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="sm:w-24 gap-2 text-primary bg-white border-2 rounded-md hover:bg-primary/10 transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 rounded-full border-2 border-t-white border-white/30 animate-spin"></div>
                  ) : (
                    <>
                      Compile
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <p className="text-sm text-muted-foreground mr-2 self-center">Examples:</p>
                {examples.map((example, index) => (
                  <ExampleButton 
                    key={index} 
                    text={example} 
                    onClick={() => handleExampleClick(example)} 
                  />
                ))}
              </div>
            </form>
          </CardContent>
        </Card>

        {tokens.length > 0 && (
          <Tabs 
            defaultValue="step-by-step" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="step-by-step">Step-by-Step View</TabsTrigger>
              <TabsTrigger value="all-stages">All Stages View</TabsTrigger>
            </TabsList>
            <TabsContent value="step-by-step" className="space-y-6">
              {steps.map((step, index) => (
                <CompilerStep
                  key={index}
                  title={step.title}
                  description={step.description}
                  isActive={index === currentStep}
                >
                  {step.component}
                </CompilerStep>
              ))}
            </TabsContent>
            <TabsContent value="all-stages" className="space-y-6">
              {steps.map((step, index) => (
                <CompilerStep
                  key={index}
                  title={step.title}
                  description={step.description}
                  isActive={true}
                >
                  {step.component}
                </CompilerStep>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;

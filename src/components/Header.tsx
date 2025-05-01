// src/components/Header.tsx
import React, { useState } from 'react';
import CodeEditor from './CodeEditor';

const Header = () => {
  const [expression, setExpression] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [executionResult, setExecutionResult] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const exampleExpressions = [
    "sum of 10 and 20",
    "product of x and y where x is 5 and y is 6",
    "difference of 100 and 40",
    "sum of 5, 10 and 15",
    "square of 9",
    "sum of a and b where a is 4 and b is 8"
  ];

  const handleExpressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpression(e.target.value);
  };

  const handleExampleClick = (example: string) => {
    setExpression(example);
    setShowExamples(false);
  };

  const handleGenerateCode = () => {
    try {
      let code = expression.toLowerCase();

      const vars: Record<string, string> = {};
      let match;

      const assignRegex = /(\w+)\s+is\s+(\d+)/g;
      while ((match = assignRegex.exec(code)) !== null) {
        vars[match[1]] = match[2];
      }

      code = code.replace(/(\w+)\s+is\s+\d+/g, '').replace("where", '').trim();

      if (code.startsWith("sum of")) {
        code = code.replace("sum of", "").replace(/and|,/g, "+");
      } else if (code.startsWith("product of")) {
        code = code.replace("product of", "").replace(/and|,/g, "*");
      } else if (code.startsWith("difference of")) {
        code = code.replace("difference of", "").replace(/and|,/g, "-");
      } else if (/square of (\w+)/.test(code)) {
        code = code.replace(/square of (\w+)/, "$1 * $1");
      }

      for (const v in vars) {
        const re = new RegExp(`\\b${v}\\b`, 'g');
        code = code.replace(re, vars[v]);
      }

      code = code.replace(/\+\s*$/, '').replace(/\-\s*$/, '').replace(/\*\s*$/, '');
      const finalCode = `let result = ${code};\nconsole.log(result);`;
      setGeneratedCode(finalCode);
    } catch (error) {
      alert("Code generation error: " + error.message);
    }
  };


  const handleExecuteCode = () => {
    try {
      if (!generatedCode || generatedCode.trim() === '') {
        alert("Please generate valid code first!");
        return;
      }

      const consoleLog = console.log;
      let output: any = undefined;

      console.log = (msg: any) => {
        output = msg;
      };

      const executeFunction = new Function(generatedCode);
      executeFunction();

      console.log = consoleLog;

      setExecutionResult(`Execution Result: ${output}`);
    } catch (error: any) {
      alert("Error executing code! " + error.message);
    }
  };

  return (
    <header className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white py-10 px-6 sm:px-8 shadow-lg rounded-xl relative min-h-screen">
      <div className="container mx-auto flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Left Column */}
        <div className="text-center sm:text-left sm:w-1/2">
          <h1 className="text-4xl font-extrabold leading-tight text-shadow">MathLang Compiler</h1>
          <p className="mt-4 text-lg max-w-xl mx-auto sm:mx-0 opacity-80">
            Transform natural language math expressions into executable code using AI logic.
          </p>

          <div className="mt-6">
            <input
              type="text"
              className="w-full p-3 bg-gray-900 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a mathematical expression"
              value={expression}
              onChange={handleExpressionChange}
            />

            {/* Buttons in a row */}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleGenerateCode}
                className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Generate Code
              </button>

              <button
                onClick={() => setShowExamples(!showExamples)}
                className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {showExamples ? "Hide Examples" : "Show Examples"}
              </button>
            </div>

            {showExamples && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-md text-left">
                <h4 className="font-semibold text-white mb-2">Try these:</h4>
                <ul className="space-y-2">
                  {exampleExpressions.map((ex, i) => (
                    <li
                      key={i}
                      className="cursor-pointer text-white hover:text-indigo-400 transition-colors"
                      onClick={() => handleExampleClick(ex)}
                    >
                      • {ex}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Generated Code:</h3>
            <CodeEditor code={generatedCode} onChange={(newCode) => setGeneratedCode(newCode)} />
          </div>

          <div className="mt-6">
            <button
              onClick={handleExecuteCode}
              className="p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Execute Code
            </button>
            <p className="mt-2 font-mono text-white">{executionResult}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="sm:w-1/2 mt-6 sm:mt-0 sm:text-center">
          <video
            autoPlay
            loop
            muted
            className="w-full max-w-md h-auto mx-auto rounded-none shadow-none"
          >
            <source src="/compiler.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Scroll down arrow */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <p className="text-lg text-white font-semibold">Scroll down to start using the Compiler...</p>
        <div className="mt-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-8 h-8 mx-auto text-white animate-bounce"
          >
            <path
              fillRule="evenodd"
              d="M3.293 7.293a1 1 0 011.414 0L10 11.586l5.293-5.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;

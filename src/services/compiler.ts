
// Compiler service for handling the compilation process

// Token types for lexical analysis
export type TokenType = 
  | 'NUMBER' 
  | 'OPERATOR' 
  | 'UNKNOWN';

// Structure for tokens
export interface Token {
  type: TokenType;
  value: string;
  originalText: string;
}

// Node types for parse tree and AST
export type NodeType = 
  | 'EXPRESSION' 
  | 'TERM' 
  | 'FACTOR' 
  | 'NUMBER' 
  | 'OPERATOR';

// Parse Tree and AST node structure
export interface TreeNode {
  type: NodeType;
  value?: string | number;
  children: TreeNode[];
}

// Constants for number words and operators
const NUMBER_WORDS: Record<string, number> = {
  'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
  'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
  'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
  'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
  'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
  'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
  'hundred': 100, 'thousand': 1000, 'million': 1000000
};

const OPERATOR_WORDS: Record<string, string> = {
  'plus': '+',
  'minus': '-',
  'times': '*',
  'multiplied by': '*',
  'divided by': '/',
  'divide': '/',
  'add': '+',
  'subtract': '-',
  'multiply': '*'
};

// Lexical Analysis: Convert input text to tokens
export function lexicalAnalysis(input: string): Token[] {
  const tokens: Token[] = [];
  const words = input.toLowerCase().split(/\s+/);

  let i = 0;
  while (i < words.length) {
    const word = words[i];
    
    // Check if it's a number word
    if (NUMBER_WORDS[word] !== undefined) {
      let value = NUMBER_WORDS[word];
      let originalText = word;
      
      // Check for compound numbers (e.g., "twenty one")
      if (i + 1 < words.length && NUMBER_WORDS[words[i+1]] !== undefined && value % 10 === 0 && NUMBER_WORDS[words[i+1]] < 10) {
        value += NUMBER_WORDS[words[i+1]];
        originalText += " " + words[i+1];
        i++;
      }
      
      tokens.push({
        type: 'NUMBER',
        value: value.toString(),
        originalText
      });
    }
    // Check if it's an operator word
    else if (OPERATOR_WORDS[word] !== undefined) {
      tokens.push({
        type: 'OPERATOR',
        value: OPERATOR_WORDS[word],
        originalText: word
      });
    }
    // Check if it's a compound operator (e.g., "multiplied by")
    else if (i + 1 < words.length && OPERATOR_WORDS[word + " " + words[i+1]] !== undefined) {
      tokens.push({
        type: 'OPERATOR',
        value: OPERATOR_WORDS[word + " " + words[i+1]],
        originalText: word + " " + words[i+1]
      });
      i++;
    }
    // Unknown token
    else if (word.trim() !== '') {
      tokens.push({
        type: 'UNKNOWN',
        value: word,
        originalText: word
      });
    }
    i++;
  }

  return tokens;
}

// Parsing: Create a Parse Tree from tokens
export function parsing(tokens: Token[]): TreeNode {
  // Simple parse tree for our example
  // This is a simplified parser that handles basic expressions

  const rootNode: TreeNode = {
    type: 'EXPRESSION',
    children: []
  };

  let currentTerm: TreeNode = {
    type: 'TERM',
    children: []
  };
  rootNode.children.push(currentTerm);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    if (token.type === 'NUMBER') {
      const numberNode: TreeNode = {
        type: 'NUMBER',
        value: parseInt(token.value),
        children: []
      };
      currentTerm.children.push(numberNode);
    } 
    else if (token.type === 'OPERATOR') {
      // Addition and subtraction create new terms
      if (token.value === '+' || token.value === '-') {
        const operatorNode: TreeNode = {
          type: 'OPERATOR',
          value: token.value,
          children: []
        };
        rootNode.children.push(operatorNode);
        
        // Start a new term
        currentTerm = {
          type: 'TERM',
          children: []
        };
        rootNode.children.push(currentTerm);
      } 
      // Multiplication and division are handled within the current term
      else {
        const operatorNode: TreeNode = {
          type: 'OPERATOR',
          value: token.value,
          children: []
        };
        currentTerm.children.push(operatorNode);
      }
    }
  }

  return rootNode;
}

// Create an Abstract Syntax Tree from the Parse Tree
export function createAST(parseTree: TreeNode): TreeNode {
  // For this simple example, we'll create a flat AST
  // In a real compiler, we would handle operator precedence here
  
  const astRoot: TreeNode = {
    type: 'EXPRESSION',
    children: []
  };
  
  // Process the parse tree to build an expression
  let currentNumber: number | null = null;
  let currentOperator: string | null = null;
  
  // Flatten the structure to extract numbers and operators
  const numbers: number[] = [];
  const operators: string[] = [];
  
  // First pass: extract all numbers and operators from the parse tree
  for (let i = 0; i < parseTree.children.length; i++) {
    const node = parseTree.children[i];
    
    if (node.type === 'TERM') {
      for (let j = 0; j < node.children.length; j++) {
        const child = node.children[j];
        if (child.type === 'NUMBER') {
          numbers.push(child.value as number);
        } else if (child.type === 'OPERATOR') {
          operators.push(child.value as string);
        }
      }
    } else if (node.type === 'OPERATOR') {
      operators.push(node.value as string);
    }
  }
  
  // Build the AST from the extracted values
  if (numbers.length > 0) {
    // Start with the first number
    let expressionValue = numbers[0];
    
    // Apply each operator with the corresponding next number
    for (let i = 0; i < operators.length && i + 1 < numbers.length; i++) {
      const operator = operators[i];
      const nextNumber = numbers[i + 1];
      
      // Create an operation node
      const operationNode: TreeNode = {
        type: 'EXPRESSION',
        value: operator,
        children: [
          { type: 'NUMBER', value: expressionValue, children: [] },
          { type: 'NUMBER', value: nextNumber, children: [] }
        ]
      };
      
      // Update the current expression value based on the operation
      switch (operator) {
        case '+': expressionValue += nextNumber; break;
        case '-': expressionValue -= nextNumber; break;
        case '*': expressionValue *= nextNumber; break;
        case '/': expressionValue = nextNumber !== 0 ? expressionValue / nextNumber : NaN; break;
      }
      
      astRoot.children.push(operationNode);
    }
    
    // Add the final result
    if (astRoot.children.length === 0) {
      astRoot.children.push({
        type: 'NUMBER',
        value: expressionValue,
        children: []
      });
    }
  }
  
  return astRoot;
}

// Code generation from AST
export function generateCode(ast: TreeNode): string {
  // Generate simple JavaScript code
  let code = "function evaluate() {\n";
  
  // Process the AST
  if (ast.children.length > 0) {
    // If there's only a single number, return it
    if (ast.children.length === 1 && ast.children[0].type === 'NUMBER') {
      code += `  let result = ${ast.children[0].value};\n`;
    } 
    // Handle expressions
    else {
      let expressionCode = "";
      
      // Check if we have any expression nodes
      const expressionNodes = ast.children.filter(node => node.type === 'EXPRESSION');
      
      if (expressionNodes.length > 0) {
        // Use the first expression to start
        const firstExpr = expressionNodes[0];
        if (firstExpr.children.length >= 2) {
          expressionCode = `${firstExpr.children[0].value} ${firstExpr.value} ${firstExpr.children[1].value}`;
        }
        
        // Add any additional operations
        for (let i = 1; i < expressionNodes.length; i++) {
          const expr = expressionNodes[i];
          if (expr.value && expr.children.length >= 2) {
            expressionCode = `(${expressionCode}) ${expr.value} ${expr.children[1].value}`;
          }
        }
        
        code += `  let result = ${expressionCode};\n`;
      } else {
        // Fallback if no expression nodes were found
        const numberNodes = ast.children.filter(node => node.type === 'NUMBER');
        if (numberNodes.length > 0) {
          code += `  let result = ${numberNodes[0].value};\n`;
        } else {
          code += "  let result = 0;\n";
        }
      }
    }
  } else {
    code += "  let result = 0;\n";
  }
  
  code += "  return result;\n";
  code += "}\n\n";
  code += "evaluate();";
  
  return code;
}

// Evaluate the code
export function evaluate(code: string): number {
  try {
    // Clean up the code for eval (careful with eval!)
    const safeCode = code
      .replace(/function evaluate\(\) \{/, '')
      .replace(/return result;/, '')
      .replace(/\}/, '')
      .replace(/evaluate\(\);/, '')
      .trim();
    
    // Extract the result assignment
    const resultMatch = safeCode.match(/result = (.*);/);
    if (resultMatch && resultMatch[1]) {
      // eslint-disable-next-line
      return eval(resultMatch[1]);
    }
    
    return 0;
  } catch (error) {
    console.error("Error evaluating expression:", error);
    return NaN;
  }
}

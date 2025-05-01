interface ResultDisplayProps {
    result: number;
    isLoading: boolean;
  }
  
  const ResultDisplay = ({ result, isLoading }: ResultDisplayProps) => {
    const displayValue = () => {
      if (isNaN(result)) {
        return "Error: Invalid expression";
      } else if (result === Infinity || result === -Infinity) {
        return "Error: Division by zero";
      } else {
        return result;
      }
    };
  
    const getResultClass = () => {
      if (isNaN(result) || result === Infinity || result === -Infinity) {
        return "text-red-600";
      }
      return "text-green-600";
    };
  
    return (
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-100 rounded-lg shadow-xl mb-6 animate-fade-in border-2 border-secondary">
        <h3 className="text-xl font-semibold mb-4 text-primary text-center">Result</h3>
        <div className="text-4xl font-extrabold text-center p-6">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="h-12 w-12 border-4 border-t-primary border-primary/30 rounded-full animate-spin"></div>
            </div>
          ) : (
            <span className={`${getResultClass()} transition-all ease-in-out duration-300`}>
              {displayValue()}
            </span>
          )}
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition duration-200 ease-in-out"
            onClick={() => window.location.reload()}
          >
            Try Another
          </button>
        </div>
      </div>
    );
  };
  
  export default ResultDisplay;
  
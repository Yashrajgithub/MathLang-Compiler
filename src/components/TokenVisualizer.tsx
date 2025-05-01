import { Token } from "../services/compiler";

interface TokenVisualizerProps {
  tokens: Token[];
}

const TokenVisualizer = ({ tokens }: TokenVisualizerProps) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl mb-8 animate-fade-in transition-all ease-in-out">
      <h3 className="text-2xl font-semibold mb-4 text-primary">Tokens</h3>
      <div className="overflow-x-auto">
        <div className="flex flex-wrap gap-4 justify-center">
          {tokens.map((token, index) => (
            <div
              key={index}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg
                ${
                  token.type === "NUMBER"
                    ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    : token.type === "OPERATOR"
                    ? "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{token.originalText}</span>
                <span className="text-xs opacity-80">
                  {token.type}: {token.value}
                </span>
              </div>

              {/* Tooltip (currently hidden by default, can improve later if needed) */}
              <div className="absolute top-1 right-1 bg-opacity-80 text-xs text-white px-2 py-1 rounded-lg bg-black opacity-0 group-hover:opacity-100 transition-opacity">
                More info
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenVisualizer;

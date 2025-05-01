import { TreeNode } from "../services/compiler";

interface TreeVisualizerProps {
  tree: TreeNode | null;
  title: string;
  type: "parse" | "ast";
}

const TreeVisualizer = ({ tree, title, type }: TreeVisualizerProps) => {
  if (!tree) {
    return null;
  }

  const renderTreeNode = (node: TreeNode, depth: number = 0, index: number = 0) => {
    const bgColor =
      node.type === "NUMBER"
        ? "bg-blue-50 border-blue-200"
        : node.type === "OPERATOR"
        ? "bg-purple-50 border-purple-200"
        : "bg-green-50 border-green-200";

    const hoverEffect =
      "hover:bg-opacity-90 transition-all duration-300 ease-in-out transform hover:scale-105";

    return (
      <div
        key={`${depth}-${index}`}
        className="flex flex-col items-center group relative"
      >
        <div
          className={`px-3 py-2 rounded-lg ${bgColor} shadow-lg mb-2 text-sm group-hover:shadow-xl ${hoverEffect}`}
        >
          <div className="font-medium">{node.type}</div>
          {node.value !== undefined && (
            <div className="text-xs opacity-80">{node.value}</div>
          )}
        </div>

        {node.children.length > 0 && (
          <>
            <div className="w-px h-6 bg-gray-300 my-2"></div>
            <div className="flex gap-4 mt-1">
              {node.children.map((child, childIndex) => (
                <div key={childIndex} className="flex flex-col items-center">
                  {renderTreeNode(child, depth + 1, childIndex)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl mb-8 animate-fade-in transition-all ease-in-out">
      <h3 className="text-2xl font-semibold mb-4 text-primary">{title}</h3>
      <div className="overflow-x-auto">
        <div className="min-w-max p-4 flex justify-center">{renderTreeNode(tree)}</div>
      </div>
    </div>
  );
};

export default TreeVisualizer;

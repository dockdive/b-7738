import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Bookmark } from "lucide-react";
import type { Tool } from "@/data/tools";

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:animate-card-hover">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <img src={tool.logo} alt={tool.name} className="w-12 h-12 rounded-lg" />
          <div>
            <h3 className="font-semibold text-lg">{tool.name}</h3>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(tool.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({tool.reviews})</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            <Bookmark className="h-4 w-4 inline mr-1" />
            {tool.bookmarks}
          </span>
        </div>
      </div>
      
      <p className="mt-4 text-gray-600">{tool.description}</p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="text-sm px-2 py-1 bg-blue-50 text-blue-600 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
      
      <div className="mt-6 flex gap-3">
        <Button
          variant="default"
          className="flex-1"
          onClick={() => window.open(tool.visitUrl, "_blank")}
        >
          Visit
        </Button>
        {tool.dealUrl && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.open(tool.dealUrl, "_blank")}
          >
            Get Deal
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ToolCard;
import React from 'react';
import { Handle, Position } from 'reactflow';
import { ExternalLink } from 'lucide-react';

const CustomRoadmapNode = ({ data }) => {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg min-w-[200px] max-w-[300px]">
      <Handle type="target" position={Position.Top} />
      
      <div className="text-center">
        <h3 className="font-bold text-lg mb-2 text-gray-800">{data.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{data.description}</p>
        
        {data.link && (
          <a 
            href={data.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
          >
            <ExternalLink size={14} />
            Learn More
          </a>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomRoadmapNode;
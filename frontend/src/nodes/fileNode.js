// src/nodes/FileNode.js
import { Position } from 'reactflow';
import { BaseNode } from './common/baseNode';

export const FileNode = ({ id, data }) => {
  return (
    <BaseNode 
      id={id} 
      label="File Upload" 
      handles={[{ type: 'source', position: Position.Right, id: 'file' }]}
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-slate-500">
          Upload Dataset (CSV/JSON)
        </label>
        
        <div className="
          border-2 border-dashed border-slate-300 rounded-md 
          bg-slate-50 hover:bg-slate-100 transition-colors
          h-20 flex flex-col items-center justify-center cursor-pointer
        ">
          <span className="text-xs text-slate-400">Drag files here</span>
          <span className="text-[10px] text-slate-300">or click to upload</span>
        </div>
      </div>
    </BaseNode>
  );
};
// src/nodes/LogicNode.js
import { Position } from 'reactflow';
import { BaseNode } from './common/baseNode';

export const LogicNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: Position.Left, id: 'condition', style: { top: '50%' } },
    { type: 'source', position: Position.Right, id: 'true', style: { top: '50%' } },
    { type: 'source', position: Position.Right, id: 'false', style: { top: '80%' } }
  ];

  return (
    <BaseNode 
      id={id} 
      label="Conditional" 
      handles={handles}
      className="h-[120px] w-[240px]"
    >
      <div className="flex flex-col h-full justify-between pb-2">
        <div className="flex items-center justify-center flex-grow text-sm font-medium text-slate-800">
          Checks Boolean
        </div>
        <div className="flex flex-col gap-3 items-end text-xs font-medium text-slate-500">
            <div className="relative top-[-10px] pr-2">
                If True <span className="text-slate-300">→</span>
            </div>
            <div className="relative top-[2px] pr-2">
                If False <span className="text-slate-300">→</span>
            </div>
        </div>
      </div>
    </BaseNode>
  );
};
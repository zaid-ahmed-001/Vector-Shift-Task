// src/nodes/IntegrationNode.js
import { Position } from 'reactflow';
import { BaseNode } from './common/baseNode';

export const IntegrationNode = ({ id, data }) => {
  const isConnected = data?.isConnected || false;

  return (
    <BaseNode 
      id={id} 
      label="Slack Integration" 
      handles={[
        { type: 'target', position: Position.Left, id: 'trigger' },
        { type: 'source', position: Position.Right, id: 'action' }
      ]}
    >
      <div className="flex items-center gap-3 p-2 bg-slate-50 rounded border border-slate-100">
        {/* Mock Logo */}
        <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center text-lg">
            🚀
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">Slack Bot</span>
          <span className="text-[10px] text-slate-500">v2.4.0</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-500">Status:</span>
        <span className={`
          text-xs font-bold px-2 py-0.5 rounded-full
          ${isConnected ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
        `}>
          {isConnected ? 'Active' : 'Pending'}
        </span>
      </div>
    </BaseNode>
  );
};
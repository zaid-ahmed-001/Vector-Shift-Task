// src/nodes/LLMNode.js
import { Position } from 'reactflow';
import { BaseNode } from './common/baseNode';

export const LLMNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: Position.Left, id: 'system', style: { top: '33%' } },
    { type: 'target', position: Position.Left, id: 'prompt', style: { top: '66%' } },
    { type: 'source', position: Position.Right, id: 'response' }
  ];

  return (
    <BaseNode id={id} label="LLM" handles={handles}>
      <div className="text-sm text-slate-600">
        <span>This is a LLM.</span>
      </div>
    </BaseNode>
  );
}
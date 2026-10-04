// src/nodes/TransformNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './common/baseNode';

export const TransformNode = ({ id, data }) => {
  const [operation, setOperation] = useState('uppercase');

  return (
    <BaseNode 
      id={id} 
      label="Data Transform" 
      handles={[
        { type: 'target', position: Position.Left, id: 'input' },
        { type: 'source', position: Position.Right, id: 'output' }
      ]}
    >
       <label className="text-xs font-medium text-slate-500">Operation</label>
       <select 
         value={operation}
         onChange={(e) => setOperation(e.target.value)}
         className="w-full text-xs p-1 border border-slate-300 rounded focus:outline-indigo-500"
       >
         <option value="uppercase">To Uppercase</option>
         <option value="lowercase">To Lowercase</option>
         <option value="json_stringify">JSON Stringify</option>
         <option value="trim">Trim Whitespace</option>
       </select>
       
       <div className="text-[10px] text-slate-400 mt-1">
         Transforms incoming string data based on selection.
       </div>
    </BaseNode>
  );
};
// src/nodes/InputNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './common/baseNode';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  return (
    <BaseNode
      id={id}
      label="Input"
      handles={[{ type: 'source', position: Position.Right, id: 'value' }]}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor={`${id}-name`} className="text-xs text-slate-500">Name</Label>
          <Input 
            id={`${id}-name`}
            value={currName} 
            onChange={(e) => setCurrName(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-slate-500">Type</Label>
          <Select value={inputType} onValueChange={setInputType}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Text">Text</SelectItem>
              <SelectItem value="File">File</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </BaseNode>
  );
}
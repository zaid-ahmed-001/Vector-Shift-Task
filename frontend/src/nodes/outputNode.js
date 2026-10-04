// src/nodes/OutputNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './common/baseNode';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  return (
    <BaseNode
      id={id}
      label="Output"
      handles={[{ type: 'target', position: Position.Left, id: 'value' }]}
    >
      <div className="flex flex-col gap-2">
         <div className="flex flex-col gap-1">
          <Label className="text-xs text-slate-500">Field Name</Label>
          <Input 
            value={currName} 
            onChange={(e) => setCurrName(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-slate-500">Type</Label>
           <Select value={outputType} onValueChange={setOutputType}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Text">Text</SelectItem>
              <SelectItem value="Image">Image</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </BaseNode>
  );
}
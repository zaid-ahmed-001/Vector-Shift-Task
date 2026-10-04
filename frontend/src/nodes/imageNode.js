// src/nodes/ImageNode.js
import { Position } from 'reactflow';
import { BaseNode } from './common/baseNode';

export const ImageNode = ({ id, data }) => {
  const imageUrl = data?.imageUrl || 'https://placehold.co/600x400';

  return (
    <BaseNode 
      id={id} 
      label="Image Viewer" 
      handles={[{ type: 'target', position: Position.Left, id: 'image_in' }]}
    >
      <div className="rounded-md overflow-hidden border border-slate-200">
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="w-full h-32 object-cover" 
        />
      </div>
      <div className="text-[10px] text-slate-400 text-center">
        Preview Mode: RGB
      </div>
    </BaseNode>
  );
};
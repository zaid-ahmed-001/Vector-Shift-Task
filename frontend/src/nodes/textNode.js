import { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { Position, useUpdateNodeInternals } from 'reactflow';
import { BaseNode } from './common/baseNode';

export const TextNode = ({ id, data }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const textareaRef = useRef(null);
  const handles = useMemo(() => {
    const variableRegex = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;
    const matches = [...currText.matchAll(variableRegex)];
    const uniqueVariables = [...new Set(matches.map(match => match[1]))];
    const dynamicHandles = uniqueVariables.map((variable, index) => ({
      id: `var-${variable}`, 
      type: 'target',
      position: Position.Left,
      style: { top: `${85 + (index * 35)}px` } 
    }));
    return [
      ...dynamicHandles,
      { 
        id: 'output', 
        type: 'source', 
        position: Position.Right,
        style: { top: '85px' }
      }
    ];
  }, [currText]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        updateNodeInternals(id);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [id, handles, updateNodeInternals]);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const textHeight = textareaRef.current.scrollHeight;
      const handleHeight = (handles.length * 35) + 20; 
      const finalHeight = Math.max(textHeight, handleHeight);
      textareaRef.current.style.height = `${finalHeight}px`;
    }
  }, [currText, handles]);

  return (
    <BaseNode id={id} label="Text & Variables" handles={handles}>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Text Content</label>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          className="
            w-full
            min-h-[80px] 
            resize-none 
            overflow-hidden 
            bg-slate-50 
            text-sm 
            border border-slate-200 
            rounded-md 
            p-2 
            focus:outline-none focus:ring-1 focus:ring-indigo-500
          "
        />
      </div>
    </BaseNode>
  );
};
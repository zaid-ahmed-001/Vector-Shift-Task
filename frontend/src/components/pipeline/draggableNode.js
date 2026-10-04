// src/components/pipeline/draggableNode.js
import { FileText, MessageSquare, Database, Code2, FileUp, Image, Link, Wrench, FileOutput } from 'lucide-react';

const iconMap = {
  customInput: FileText,
  llm: MessageSquare,
  customOutput: FileOutput,
  text: Database,
  logic: Code2,
  file: FileUp,
  image: Image,
  integration: Link,
  transform: Wrench,
};

export const DraggableNode = ({ type, label }) => {
    const IconComponent = iconMap[type] || FileText;

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className={`
          group relative flex flex-col items-center justify-center 
          min-w-[80px] h-[70px] 
          bg-white rounded-lg border border-slate-200 
          cursor-grab transition-all duration-200
          hover:border-indigo-500 hover:shadow-md hover:-translate-y-0.5
          active:cursor-grabbing
        `}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
          <IconComponent 
            className="w-6 h-6 mb-2 text-slate-500 transition-colors group-hover:text-indigo-500" 
            strokeWidth={1.5}
          />
          <span className="text-xs font-medium text-slate-500 transition-colors group-hover:text-indigo-600">
            {label}
          </span>
      </div>
    );
  };
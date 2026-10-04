// src/nodes/common/BaseNode.js
import { Handle } from 'reactflow';
import { X } from 'lucide-react'; 
import { useReactFlow } from 'reactflow';

export const BaseNode = ({ id, label, children, handles = [], selected, data }) => {
  const { setNodes } = useReactFlow();
  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  };
  const isHighlighted = data?.isHighlight;
  let borderStyle = "border-slate-200 shadow-sm hover:border-slate-300";
  if (selected) {
    borderStyle = "border-indigo-600 shadow-[0_0_0_1px_rgba(79,70,229,1)] shadow-indigo-100";
  } else if (isHighlighted) {
    borderStyle = "border-indigo-500 shadow-md shadow-indigo-200 ring-1 ring-indigo-500";
  }

  return (
    <div className={`
      relative flex flex-col 
      w-[300px] bg-white rounded-xl 
      transition-all duration-200
      border-[1.5px] 
      ${borderStyle}
    `}>
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id} 
          className={`
            !w-3.5 !h-3.5 !bg-white !border-[1.5px] !z-50
            ${handle.type === 'target' ? '!border-indigo-500' : '!border-violet-500'}
            hover:!bg-slate-100
          `}
          style={{
            ...handle.style,
            width: '14px',
            height: '14px',
          }}
        />
      ))}

      <div className={`
        flex items-center justify-between 
        px-4 py-3 
        bg-slate-50/50 
        rounded-t-xl border-b border-slate-100
      `}>
        <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">
             {label}
           </span>
        </div>

        <button 
          onClick={handleDelete}
          className="
            p-1 rounded-md 
            text-slate-400 hover:text-red-500 hover:bg-red-50 
            transition-colors duration-200
          "
          title="Delete Node"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div 
        className="flex-grow p-4 flex flex-col gap-3 nodrag cursor-default overflow-y-auto max-h-[500px]"
        style={{ scrollbarWidth: 'thin' }} 
      >
        {children}
      </div>
    </div>
  );
};
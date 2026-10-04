// src/components/pipeline/PipelineToolbar.js
import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { Search, X } from 'lucide-react';

const tabs = [
    {
        id: 'general',
        label: 'General',
        nodes: [
            { type: 'customInput', label: 'Input' },
            { type: 'customOutput', label: 'Output' },
            { type: 'text', label: 'Text' },
            { type: 'image', label: 'Image' },
            { type: 'file', label: 'File Save' },
        ]
    },
    {
        id: 'llm',
        label: 'LLMs',
        nodes: [
            { type: 'llm', label: 'LLM' },
        ]
    },
    {
        id: 'logic',
        label: 'Logic',
        nodes: [
            { type: 'logic', label: 'Logic' },
            { type: 'transform', label: 'Transform' },
        ]
    },
    {
        id: 'integrations',
        label: 'Integrations',
        nodes: [
            { type: 'integration', label: 'Integration' },
        ]
    },
];

export const PipelineToolbar = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [query, setQuery] = useState('');
    const allNodes = tabs.flatMap(tab => tab.nodes);
    const displayedNodes = query.length > 0
        ? allNodes.filter(node => node.label.toLowerCase().includes(query.toLowerCase()))
        : tabs.find(t => t.id === activeTab)?.nodes || [];

    return (
        <div className="p-5 border-b border-slate-200 bg-white w-full shadow-sm">
            <div className="flex items-center justify-between mb-4 gap-4">
                <div className="relative flex-grow max-w-xs group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search components..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="
                            w-full pl-9 pr-8 py-1.5 h-9
                            text-xs font-medium bg-slate-50 border border-slate-200 rounded-md
                            focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                            placeholder:text-slate-400 transition-all
                        "
                    />
                    {query && (
                        <button 
                            onClick={() => setQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>
            {!query && (
                <div className="flex items-center gap-6 mb-5 border-b border-slate-100 pb-1 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative text-sm font-medium pb-2 px-1 transition-all whitespace-nowrap
                                ${activeTab === tab.id 
                                    ? 'text-indigo-600' 
                                    : 'text-slate-500 hover:text-slate-700'
                                }
                            `}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-600 rounded-t-full animate-in zoom-in-50 duration-200" />
                            )}
                        </button>
                    ))}
                </div>
            )}
            <div className="flex flex-wrap gap-3 animate-in fade-in duration-300 min-h-[60px]">
                {displayedNodes.length > 0 ? (
                    displayedNodes.map((node) => (
                        <DraggableNode key={node.type} type={node.type} label={node.label} />
                    ))
                ) : (
                    <div className="w-full flex flex-col items-center justify-center py-6 text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                        <Search className="w-8 h-8 mb-2 opacity-20" />
                        <span className="text-xs">No components found for "{query}"</span>
                    </div>
                )}
            </div>
        </div>
    );
};
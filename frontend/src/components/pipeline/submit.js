import { useState } from 'react';
import { useStore } from '../../store/store';
import { shallow } from 'zustand/shallow';
import { Play, Loader2, CheckCircle2, AlertCircle, History, Layers, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
});

export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);
    const [isLoading, setIsLoading] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [runHistory, setRunHistory] = useState([]);
    const [currentRun, setCurrentRun] = useState(null);

    const handleSubmit = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Analyzing pipeline structure...");
        try {
            const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) throw new Error('Backend analysis failed');
            
            const data = await response.json();
            const runRecord = {
                id: Date.now(),
                timestamp: new Date().toLocaleTimeString(),
                ...data,
                nodes_count: nodes.length,
                edges_count: edges.length,
                structure: { nodes, edges } 
            };
            setCurrentRun(runRecord);
            setRunHistory(prev => [runRecord, ...prev]);
            toast.success("Analysis Complete", { id: toastId });
            setIsSheetOpen(true);
        } catch (error) {
            console.error(error);
            toast.error(`Analysis Failed: ${error.message}`, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <div className="flex items-center justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-md shadow-sm transition-all duration-200
                        text-white text-sm font-medium
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                        ${isLoading 
                            ? 'bg-indigo-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md active:transform active:scale-95'
                        }
                    `}
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    {isLoading ? 'Processing...' : 'Run Pipeline'}
                </button>
            </div>

            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full bg-white border-l shadow-2xl">
                <SheetHeader className="mb-4">
                    <SheetTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
                        <Layers className="w-5 h-5 text-indigo-600" />
                        Pipeline Analysis
                    </SheetTitle>
                    <SheetDescription>
                        Detailed review of your pipeline structure and execution flow.
                    </SheetDescription>
                </SheetHeader>

                {currentRun ? (
                    <Tabs defaultValue="current" className="flex-1 flex flex-col overflow-hidden">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-lg">
                            <TabsTrigger value="current">Current Run</TabsTrigger>
                            <TabsTrigger value="history">History ({runHistory.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="current" className="flex-1 overflow-auto pr-2 mt-4 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                    <div className="text-xs font-medium text-slate-500 uppercase">Component Count</div>
                                    <div className="mt-1 flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-slate-800">{currentRun.num_nodes}</span>
                                        <span className="text-sm text-slate-500">nodes</span>
                                    </div>
                                    <div className="mt-1 flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-slate-800">{currentRun.num_edges}</span>
                                        <span className="text-sm text-slate-500">edges</span>
                                    </div>
                                </div>

                                <div className={`p-4 border rounded-lg ${currentRun.is_dag ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                    <div className="text-xs font-medium uppercase opacity-70">Pipeline Status</div>
                                    <div className="mt-2 flex items-center gap-2">
                                        {currentRun.is_dag ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                <span className="font-bold text-emerald-800">Valid DAG</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-5 h-5 text-red-600" />
                                                <span className="font-bold text-red-800">Cyclic Error</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="mt-1 text-xs opacity-80">
                                        {currentRun.is_dag ? "Ready for execution." : "Loops detected. Fix required."}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                    Data Flow Execution
                                </h3>
                                <div className="space-y-2">
                                    {edges.length > 0 ? (
                                        edges.map((edge, idx) => {
                                            const sourceNode = nodes.find(n => n.id === edge.source);
                                            const targetNode = nodes.find(n => n.id === edge.target);
                                            
                                            return (
                                                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-md border border-slate-100 text-sm">
                                                    <Badge variant="outline" className="bg-white font-mono text-xs">
                                                        {sourceNode?.data?.label || sourceNode?.type || edge.source}
                                                    </Badge>
                                                    <ArrowRight className="w-3 h-3 text-slate-400" />
                                                    <Badge variant="outline" className="bg-white font-mono text-xs">
                                                        {targetNode?.data?.label || targetNode?.type || edge.target}
                                                    </Badge>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg border border-dashed text-sm">
                                            No connections defined yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1" className="border-b-0">
                                    <AccordionTrigger className="text-xs text-slate-500">View Raw Response</AccordionTrigger>
                                    <AccordionContent>
                                        <pre className="p-3 bg-slate-900 text-slate-50 rounded-md text-[10px] overflow-auto max-h-40">
                                            {JSON.stringify(currentRun, null, 2)}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </TabsContent>

                        <TabsContent value="history" className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full pr-4">
                                <div className="space-y-4 pt-2">
                                    {runHistory.length === 0 ? (
                                        <div className="text-center py-10 text-slate-400 text-sm">No history available</div>
                                    ) : (
                                        runHistory.map((run) => (
                                            <div key={run.id} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={run.is_dag ? "default" : "destructive"} className="text-[10px] px-1.5 h-5">
                                                            {run.is_dag ? "DAG" : "Cyclic"}
                                                        </Badge>
                                                        <span className="text-xs font-mono text-slate-500">{run.timestamp}</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                                    <div className="bg-white px-2 py-1 rounded border">Nodes: {run.num_nodes}</div>
                                                    <div className="bg-white px-2 py-1 rounded border">Edges: {run.num_edges}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Play className="w-8 h-8 opacity-20" />
                        </div>
                        <h4 className="font-semibold text-slate-600">No Analysis Run Yet</h4>
                        <p className="text-sm max-w-[200px] mt-2">Click the "Run Pipeline" button to analyze your flow.</p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
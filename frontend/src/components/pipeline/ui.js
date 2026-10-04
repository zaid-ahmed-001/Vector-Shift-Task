// ui.js
import { useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from '../../store/store';
import { shallow } from 'zustand/shallow';
import { InputNode } from '../../nodes/inputNode';
import { LLMNode } from '../../nodes/llmNode';
import { OutputNode } from '../../nodes/outputNode';
import { TextNode } from '../../nodes/textNode';
import { LogicNode } from '../../nodes/logicNode';
import { FileNode } from '../../nodes/fileNode';
import { ImageNode } from '../../nodes/imageNode';
import { IntegrationNode } from '../../nodes/integrationNode';
import { TransformNode } from '../../nodes/transformNode';
import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  logic: LogicNode,
  file: FileNode,
  image: ImageNode,
  integration: IntegrationNode,
  transform: TransformNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [highlightPath, setHighlightPath] = useState({ 
        nodeIds: new Set(), 
        edgeIds: new Set() 
    });
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const getDownstreamPath = (nodeId) => {
        const visitedNodes = new Set();
        const visitedEdges = new Set();
        const queue = [nodeId];
        
        visitedNodes.add(nodeId);

        while (queue.length > 0) {
            const currentId = queue.shift();
            
            const outgoingEdges = edges.filter(edge => edge.source === currentId);
            
            outgoingEdges.forEach(edge => {
                visitedEdges.add(edge.id);
                if (!visitedNodes.has(edge.target)) {
                    visitedNodes.add(edge.target);
                    queue.push(edge.target);
                }
            });
        }
        
        return { nodeIds: visitedNodes, edgeIds: visitedEdges };
    };

    const onNodeMouseEnter = useCallback((_, node) => {
        const path = getDownstreamPath(node.id);
        setHighlightPath(path);
    }, [edges]); 

    const onNodeMouseLeave = useCallback(() => {
        setHighlightPath({ nodeIds: new Set(), edgeIds: new Set() });
    }, []);

    const displayNodes = useMemo(() => {
        return nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                isHighlight: highlightPath.nodeIds.has(node.id)
            },
            style: (highlightPath.nodeIds.size > 0 && !highlightPath.nodeIds.has(node.id)) 
                ? { opacity: 0.3, transition: 'opacity 0.2s' } 
                : { opacity: 1, transition: 'opacity 0.2s' }
        }));
    }, [nodes, highlightPath]);

    const displayEdges = useMemo(() => {
        return edges.map(edge => {
            const isHighlighted = highlightPath.edgeIds.has(edge.id);
            return {
                ...edge,
                animated: isHighlighted, // Animate the connecting lines
                style: {
                    stroke: isHighlighted ? '#4f46e5' : '#b1b1b7', // Indigo if active, Gray default
                    strokeWidth: isHighlighted ? 3 : 1.5,
                    opacity: (highlightPath.edgeIds.size > 0 && !isHighlighted) ? 0.3 : 1,
                    transition: 'all 0.2s'
                },
                zIndex: isHighlighted ? 1000 : 0
            };
        });
    }, [edges, highlightPath]);

    return (
        <>
        <div ref={reactFlowWrapper} style={{width: '100vw', height: '70vh'}}>
            <ReactFlow
                nodes={displayNodes}
                edges={displayEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
        </>
    )
}
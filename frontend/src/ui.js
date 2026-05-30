// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import {
  ApiRequestNode,
  ConditionNode,
  DatabaseNode,
  FilterNode,
  TransformNode,
} from './nodes/customNodes';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: {
    strokeWidth: 2,
    stroke: '#64748b',
  },
};
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  transform: TransformNode,
  apiRequest: ApiRequestNode,
  condition: ConditionNode,
  database: DatabaseNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  deleteEdge: state.deleteEdge,
});

export const PipelineUI = ({ isDarkMode }) => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      deleteEdge
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
      
            // check if the dropped element is valid
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
        [addNode, getNodeID, reactFlowInstance]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onEdgeDoubleClick = useCallback(
      (event, edge) => {
        event.preventDefault();
        deleteEdge(edge.id);
      },
      [deleteEdge]
    );

    return (
        <div ref={reactFlowWrapper} className="reactflow-wrapper">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeDoubleClick={onEdgeDoubleClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineStyle={{ stroke: isDarkMode ? '#d4d4d8' : '#475569', strokeWidth: 2 }}
                fitView
            >
                <Background color={isDarkMode ? '#444444' : '#b8c2d1'} gap={gridSize} />
                <Controls className="workflow-controls" />
                <MiniMap
                    className="workflow-minimap"
                    nodeColor={isDarkMode ? '#2a2a2a' : '#e2e8f0'}
                    nodeStrokeColor={isDarkMode ? '#5a5a5a' : '#94a3b8'}
                    maskColor={isDarkMode ? 'rgba(5, 5, 5, 0.78)' : 'rgba(241, 245, 249, 0.72)'}
                    style={{ backgroundColor: isDarkMode ? '#111111' : '#ffffff' }}
                    pannable
                    zoomable
                />
            </ReactFlow>
        </div>
    )
}

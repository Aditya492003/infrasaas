import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import { InfrastructureNode } from './CustomNodes/InfrastructureNode';
import { ClientNode } from './CustomNodes/ClientNode';
import { getComponentDef } from '../../data/infrastructureTypes';

export const ArchitectureCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setNodes,
  setEdges,
  onSelectNode,
  selectedNodeId,
  advisorSuggestions = []
}) => {
  const nodeTypes = useMemo(() => ({
    infrastructure: InfrastructureNode,
    client: ClientNode
  }), []);

  // Highlight invalid edges with pulsating red warning styling
  const invalidEdgeIdSet = useMemo(() => {
    return new Set(advisorSuggestions.filter(s => s.edgeId).map(s => s.edgeId));
  }, [advisorSuggestions]);

  const styledEdges = useMemo(() => {
    return edges.map(edge => {
      if (invalidEdgeIdSet.has(edge.id)) {
        return {
          ...edge,
          className: `${edge.className || ''} invalid`,
          animated: true,
          style: { stroke: '#ef4444', strokeWidth: 2.5 }
        };
      }
      return edge;
    });
  }, [edges, invalidEdgeIdSet]);

  // Handle new connection creation
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({
        ...params,
        animated: true,
        style: { stroke: '#64748b', strokeWidth: 2 }
      }, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }) => {
      if (selectedNodes && selectedNodes.length > 0) {
        onSelectNode(selectedNodes[0]);
      } else {
        onSelectNode(null);
      }
    },
    [onSelectNode]
  );

  // Drag-and-drop support: drop component onto canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/infrasim-component');
      if (!type) return;

      const compDef = getComponentDef(type);
      
      // Calculate canvas-relative coordinates
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 40,
      };

      const newNodeId = `${type}-${Date.now().toString().slice(-4)}`;
      const newNode = {
        id: newNodeId,
        type: 'infrastructure',
        position,
        data: {
          type,
          name: compDef.name,
          category: compDef.category,
          config: { ...compDef.defaultConfig },
          metrics: null
        }
      };

      setNodes((nds) => nds.concat(newNode));
      onSelectNode(newNode);
    },
    [setNodes, onSelectNode]
  );

  return (
    <div className="w-full h-full relative bg-slate-50 overflow-hidden" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2.0}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1.5} 
          color="#cbd5e1" 
        />
        <Controls 
          showInteractive={false}
          className="!bg-white !border !border-slate-200 !shadow-sm !rounded-md !m-4" 
        />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'client') return '#0f172a';
            if (node.data?.type === 'postgresql') return '#3b82f6';
            if (node.data?.type === 'redis') return '#f97316';
            if (node.data?.category === 'compute') return '#6366f1';
            return '#94a3b8';
          }}
          className="!bg-white !border !border-slate-200 !shadow-sm !rounded-md !m-4"
          maskColor="rgba(241, 245, 249, 0.7)"
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};

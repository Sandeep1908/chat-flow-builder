import React, { useRef, useState, useCallback } from 'react';
import Node from './Node';
import EditableTextNodeContent from './EditableTextNodeContent';
import ImageNodeContent from './ImageNodeContent';
import ConnectionLine from './ConnectionLine';

const FlowCanvas = ({ nodes, connections, selectedNodeId, onSelectNode, onUpdateNode, onAddConnection }) => {
  const canvasRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [tempConnection, setTempConnection] = useState(null);

  const handleMouseDown = (e) => {
    const handle = e.target.closest('.handle');
    if (!handle) {
      onSelectNode(null);
      return;
    }
    const handleType = handle.dataset.handleType;
    const nodeId = handle.dataset.nodeId;
    const canConnect = handle.dataset.canConnect === 'true';
    if (handleType === 'source' && canConnect) {
      const rect = handle.getBoundingClientRect();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setIsConnecting(true);
      setConnectionStart({
        nodeId,
        x: rect.left + rect.width / 2 - canvasRect.left,
        y: rect.top + rect.height / 2 - canvasRect.top,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isConnecting || !connectionStart) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    setTempConnection({
      sourceX: connectionStart.x,
      sourceY: connectionStart.y,
      targetX: mouseX,
      targetY: mouseY,
    });
  };

  const handleMouseUp = (e) => {
    if (!isConnecting || !connectionStart) return;
    const handle = e.target.closest('.handle');
    if (handle && handle.dataset.handleType === 'target') {
      const targetNodeId = handle.dataset.nodeId;
      if (targetNodeId !== connectionStart.nodeId) {
        const existing = connections.find(
          (c) => c.sourceId === connectionStart.nodeId && c.targetId === targetNodeId
        );
        if (!existing) onAddConnection(connectionStart.nodeId, targetNodeId);
      }
    }
    setIsConnecting(false);
    setConnectionStart(null);
    setTempConnection(null);
  };

  const getConnectionCoordinates = useCallback(
    (connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.sourceId);
      const targetNode = nodes.find((n) => n.id === connection.targetId);
      if (!sourceNode || !targetNode) return null;
      const sourceHeight = sourceNode.type === 'imageNode' ? 140 : 88;
      return {
        ...connection,
        sourceX: sourceNode.x + 100,
        sourceY: sourceNode.y + sourceHeight,
        targetX: targetNode.x + 100,
        targetY: targetNode.y,
      };
    },
    [nodes]
  );

  return (
    <div
      ref={canvasRef}
      id="flow-canvas"
      className="relative w-full h-full bg-gray-50 overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {connections.map((c) => {
          const coords = getConnectionCoordinates(c);
          return coords ? <ConnectionLine key={c.id} connection={coords} /> : null;
        })}
        {tempConnection && (
          <path
            d={`M ${tempConnection.sourceX} ${tempConnection.sourceY} 
                C ${tempConnection.sourceX} ${(tempConnection.sourceY + tempConnection.targetY) / 2}, 
                  ${tempConnection.targetX} ${(tempConnection.sourceY + tempConnection.targetY) / 2}, 
                  ${tempConnection.targetX} ${tempConnection.targetY}`}
            stroke="#9CA3AF"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
        )}
      </svg>

      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          onSelect={onSelectNode}
          onUpdateNode={onUpdateNode}
          connections={connections}
        >
          {node.type === 'textNode' && (
            <EditableTextNodeContent node={node} onUpdateNode={onUpdateNode} />
          )}
          {node.type === 'imageNode' && <ImageNodeContent data={node.data} />}
        </Node>
      ))}
    </div>
  );
};

export default FlowCanvas;

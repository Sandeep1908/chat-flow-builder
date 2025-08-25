import React, { useRef, useState, useEffect } from 'react';

const Node = ({ node, isSelected, onSelect, onUpdateNode, connections, children }) => {
  const nodeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const sourceConnections = connections.filter(conn => conn.sourceId === node.id).length;
  const canConnectSource = node.type !== 'imageNode';

  const handleMouseDown = (e) => {
    if (e.target.closest('.handle') || e.target.tagName === 'TEXTAREA') return;
    e.stopPropagation();
    const rect = nodeRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDragging(true);
    onSelect(node.id);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const canvas = document.getElementById('flow-canvas');
      const canvasRect = canvas.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;
      onUpdateNode(node.id, { ...node, x: Math.max(0, newX), y: Math.max(0, newY) });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, node, onUpdateNode]);

  return (
    <div
      ref={nodeRef}
      className={`absolute bg-white border-2 rounded-lg shadow-lg min-w-[200px] cursor-move select-none transition-all duration-150 
      ${isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'} 
      ${isDragging ? 'z-50 scale-105' : 'z-10'}`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="handle absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-crosshair hover:bg-blue-600"
        data-handle-type="target"
        data-node-id={node.id}
      />

      {children}

      {canConnectSource && (
        <div
          className={`handle absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 border-2 border-white rounded-full cursor-crosshair 
          ${sourceConnections < 1 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
          data-handle-type="source"
          data-node-id={node.id}
          data-can-connect={sourceConnections < 1}
        />
      )}
    </div>
  );
};

export default Node;

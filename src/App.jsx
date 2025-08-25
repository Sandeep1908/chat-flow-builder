import React, { useState, useEffect } from 'react';
import Toast from './components/Toast';
import NodesPanel from './components/NodesPanel';
import SettingsPanel from './components/SettingsPanel';
import FlowCanvas from './components/FlowCanvas';

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [toast, setToast] = useState(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  useEffect(() => {
    try {
      const savedNodes = localStorage.getItem('flow-nodes');
      const savedConnections = localStorage.getItem('flow-connections');
      if (savedNodes) setNodes(JSON.parse(savedNodes));
      if (savedConnections) setConnections(JSON.parse(savedConnections));
    } catch (error) {
      console.error('Failed to load data', error);
    }
  }, []);

  const showToast = (message, type) => setToast({ message, type });

  const handleDrop = (e) => {
    e.preventDefault();
    const nodeConfig = JSON.parse(e.dataTransfer.getData('application/json'));
    const canvasRect = document.getElementById('flow-canvas').getBoundingClientRect();
    const x = e.clientX - canvasRect.left - 100;
    const y = e.clientY - canvasRect.top - 40;
    const newNode = {
      id: `${nodeConfig.type}-${Date.now()}`,
      type: nodeConfig.type,
      x: Math.max(0, x),
      y: Math.max(0, y),
      data: { ...nodeConfig.defaultData },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleUpdateNode = (nodeId, updatedNode) =>
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? updatedNode : n)));

  const handleAddConnection = (sourceId, targetId) => {
    const newConnection = { id: `${sourceId}-${targetId}`, sourceId, targetId };
    setConnections((prev) => [...prev, newConnection]);
  };

  const handleSave = () => {
    if (nodes.length > 1) {
      const nodesWithoutIncoming = nodes.filter(
        (n) => !connections.some((c) => c.targetId === n.id)
      );
      if (nodesWithoutIncoming.length > 1) {
        showToast('Error: Flow has multiple starting points.', 'error');
        return;
      }
    }
    try {
      localStorage.setItem('flow-nodes', JSON.stringify(nodes));
      localStorage.setItem('flow-connections', JSON.stringify(connections));
      showToast('Flow saved successfully!', 'success');
    } catch (error) {
      console.error('Failed to save', error);
      showToast('Error: Could not save flow.', 'error');
    }
  };

  const handleClear = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    localStorage.removeItem('flow-nodes');
    localStorage.removeItem('flow-connections');
    showToast('Flow cleared!', 'success');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {selectedNode ? (
        <SettingsPanel selectedNode={selectedNode} onUpdateNode={handleUpdateNode} />
      ) : (
        <NodesPanel />
      )}

      <div className="flex-1 relative" onDrop={handleDrop} onDragOver={handleDragOver}>
        <FlowCanvas
          nodes={nodes}
          connections={connections}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          onUpdateNode={handleUpdateNode}
          onAddConnection={handleAddConnection}
        />
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 text-center">
            <div className="text-xs text-gray-600">
              Nodes: <span className="font-bold">{nodes.length}</span> | Connections:{' '}
              <span className="font-bold">{connections.length}</span>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors shadow-lg"
          >
            Clear Flow
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
          >
            Save Flow
          </button>
        </div>
      </div>
    </div>
  );
}

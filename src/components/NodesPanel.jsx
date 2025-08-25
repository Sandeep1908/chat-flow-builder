import React from 'react';

const availableNodes = [
  { type: 'textNode', label: 'Message', icon: '📧', defaultData: { text: 'Type your message here...' } },
];

const NodesPanel = () => {
  const handleDragStart = (e, nodeConfig) => {
    e.dataTransfer.setData('application/json', JSON.stringify(nodeConfig));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Nodes Panel</h3>
      <div className="space-y-2">
        {availableNodes.map((nodeConfig) => (
          <div
            key={nodeConfig.type}
            className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-blue-50 hover:border-blue-200 transition-colors"
            draggable
            onDragStart={(e) => handleDragStart(e, nodeConfig)}
          >
            <span className="text-xl mr-3">{nodeConfig.icon}</span>
            <span className="text-sm font-medium text-gray-700">{nodeConfig.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodesPanel;

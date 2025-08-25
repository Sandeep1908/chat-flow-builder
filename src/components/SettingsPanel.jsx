import React, { useState, useEffect } from 'react';

const SettingsPanel = ({ selectedNode, onUpdateNode }) => {
  const [nodeData, setNodeData] = useState(selectedNode?.data || {});

  useEffect(() => {
    setNodeData(selectedNode?.data || {});
  }, [selectedNode]);

  const handleDataChange = (key, value) => {
    const newData = { ...nodeData, [key]: value };
    setNodeData(newData);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { ...selectedNode, data: newData });
    }
  };

  if (!selectedNode) return null;

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Settings</h3>

      {selectedNode.type === 'textNode' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Message Text</label>
          <textarea
            value={nodeData.text || ''}
            onChange={(e) => handleDataChange('text', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg resize-none h-32 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your message..."
          />
        </div>
      )}

      {selectedNode.type === 'imageNode' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="text"
            value={nodeData.src || ''}
            onChange={(e) => handleDataChange('src', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.png"
          />
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;

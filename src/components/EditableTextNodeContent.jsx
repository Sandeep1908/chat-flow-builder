import React, { useState, useRef, useEffect } from 'react';

const EditableTextNodeContent = ({ node, onUpdateNode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(node.data.text);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setText(node.data.text);
  }, [node.data.text]);

  const handleDoubleClick = () => setIsEditing(true);

  const handleBlur = () => {
    onUpdateNode(node.id, { ...node, data: { ...node.data, text } });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleBlur();
  };

  return (
    <div className="p-4">
      <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <span className="mr-2">📧</span> Message
      </div>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="nowheel nodrag text-sm text-gray-900 w-full border-0 p-0 m-0 resize-none bg-blue-50 focus:ring-0"
          style={{ minHeight: '40px' }}
        />
      ) : (
        <div onDoubleClick={handleDoubleClick} className="text-sm text-gray-900 break-words" style={{ minHeight: '40px' }}>
          {node.data.text || 'Double-click to edit...'}
        </div>
      )}
    </div>
  );
};

export default EditableTextNodeContent;

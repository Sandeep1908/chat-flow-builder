import React from 'react';

const ConnectionLine = ({ connection }) => {
  const { sourceX, sourceY, targetX, targetY } = connection;
  const midY = (sourceY + targetY) / 2;
  const path = `M ${sourceX} ${sourceY} C ${sourceX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`;
  return (
    <g>
      <path d={path} stroke="#3B82F6" strokeWidth="2" fill="none" />
    </g>
  );
};

export default ConnectionLine;

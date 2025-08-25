import React from 'react';

const ImageNodeContent = ({ data }) => (
  <div className="p-4">
    <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
      <span className="mr-2">🖼️</span> Image
    </div>
    {data.src ? (
      <img
        src={data.src}
        alt="User content"
        className="rounded-md object-cover w-full h-auto mt-2"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/200x100/e0e0e0/777?text=Invalid+URL';
        }}
      />
    ) : (
      <div className="text-xs text-gray-500 bg-gray-100 p-4 rounded-md text-center">
        No image URL provided.
      </div>
    )}
  </div>
);

export default ImageNodeContent;

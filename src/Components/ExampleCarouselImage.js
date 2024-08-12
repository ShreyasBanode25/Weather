import React from 'react';

const ExampleCarouselImage = ({ text }) => {
  return (
    <div style={{ height: '300px', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {text}
    </div>
  );
};

export default ExampleCarouselImage;
